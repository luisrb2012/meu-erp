// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
});

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- FUNÇÃO AUXILIAR PARA ROTAS CRUD GENÉRICAS ---
const createCrudRoutes = (app, tableName, pool) => {
    const dbTableName = tableName.replace(/-/g, '_');

    // GET: Listar todos
    app.get(`/api/${tableName}`, async (req, res) => {
        try {
            const { rows } = await pool.query(`SELECT * FROM ${dbTableName} ORDER BY id ASC`);
            res.json(rows);
        } catch (err) {
            console.error(`Erro ao buscar ${tableName}:`, err.message);
            res.status(500).json({ error: 'Erro de servidor' });
        }
    });

    // GET: Buscar por ID
    app.get(`/api/${tableName}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const { rows } = await pool.query(`SELECT * FROM ${dbTableName} WHERE id = $1`, [id]);
            if (rows.length === 0) return res.status(404).json({ error: 'Registro não encontrado' });
            res.json(rows[0]);
        } catch (err) {
            console.error(`Erro ao buscar em ${tableName}:`, err.message);
            res.status(500).json({ error: 'Erro de servidor' });
        }
    });

    // POST: Criar novo
    app.post(`/api/${tableName}`, async (req, res) => {
        try {
            const keys = Object.keys(req.body).filter(k => k !== 'id');
            const dbKeys = keys.map(k => k.replace(/([A-Z])/g, "_$1").toLowerCase());
            const values = keys.map(k => req.body[k]);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            
            const query = `INSERT INTO ${dbTableName} (${dbKeys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            const { rows } = await pool.query(query, values);
            
            res.status(201).json(rows[0]);
        } catch (err) {
            console.error(`Erro ao criar em ${tableName}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // PUT: Atualizar
    app.put(`/api/${tableName}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const keys = Object.keys(req.body).filter(k => k !== 'id');
            const fields = keys.map((key, i) => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = $${i + 1}`).join(', ');
            const values = keys.map(k => req.body[k]);

            const query = `UPDATE ${dbTableName} SET ${fields} WHERE id = $${keys.length + 1} RETURNING *`;
            const { rows } = await pool.query(query, [...values, id]);

            if (rows.length === 0) return res.status(404).json({ error: 'Registro não encontrado' });
            res.json(rows[0]);
        } catch (err) {
            console.error(`Erro ao atualizar em ${tableName}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE: Deletar
    app.delete(`/api/${tableName}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const deleteOp = await pool.query(`DELETE FROM ${dbTableName} WHERE id = $1`, [id]);
            if (deleteOp.rowCount === 0) return res.status(404).json({ error: 'Registro não encontrado' });
            res.status(204).send();
        } catch (err) {
            console.error(`Erro ao deletar em ${tableName}:`, err.message);
            res.status(500).json({ error: err.message });
        }
    });
};

// --- APLICAÇÃO DAS ROTAS CRUD GENÉRICAS ---
createCrudRoutes(app, 'products', pool);
createCrudRoutes(app, 'suppliers', pool);
createCrudRoutes(app, 'costcenters', pool);
createCrudRoutes(app, 'expensecategories', pool);
createCrudRoutes(app, 'paymentrepositories', pool);
createCrudRoutes(app, 'revenuesources', pool);
createCrudRoutes(app, 'productunits', pool);
createCrudRoutes(app, 'productitemtypes', pool);
createCrudRoutes(app, 'users', pool);
createCrudRoutes(app, 'groups', pool);
createCrudRoutes(app, 'expenses', pool);
createCrudRoutes(app, 'revenues', pool);
createCrudRoutes(app, 'invoicings', pool);
createCrudRoutes(app, 'cashmovements', pool);
createCrudRoutes(app, 'allocationrules', pool);

// --- ROTAS COM LÓGICA CUSTOMIZADA E TRANSAÇÕES ---

// MOVIMENTAÇÕES DE ESTOQUE
app.get('/api/stock-movements', async (req, res) => { try { const { rows } = await pool.query('SELECT * FROM stock_movements ORDER BY date DESC, id DESC'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }});
app.post('/api/stock-movements', async (req, res) => {
    const { type, productId, quantity, date, unitPrice, costCenterId, responsible, justification } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const movementQuery = `INSERT INTO stock_movements (type, product_id, quantity, date, unit_price, cost_center_id, responsible, justification) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const movementResult = await client.query(movementQuery, [type, productId, quantity, date, unitPrice, costCenterId, responsible, justification]);
        const updateStockQuery = `UPDATE products SET current_stock = current_stock + $1 WHERE id = $2 RETURNING *`;
        const productResult = await client.query(updateStockQuery, [quantity, productId]);
        if (productResult.rows.length === 0) throw new Error('Produto não encontrado para atualizar estoque.');
        if (productResult.rows[0].current_stock < 0) throw new Error('Estoque insuficiente para a saída.');
        await client.query('COMMIT');
        res.status(201).json({ newMovement: movementResult.rows[0], updatedProduct: productResult.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro na transação de movimentação de estoque:', err.message);
        res.status(500).json({ error: `Erro de servidor: ${err.message}` });
    } finally {
        client.release();
    }
});

// PEDIDOS DE COMPRA
app.get('/api/purchase-orders', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_orders ORDER BY date DESC, id DESC');
        for (const order of rows) {
            const itemsResult = await pool.query('SELECT * FROM purchase_order_items WHERE order_id = $1', [order.id]);
            order.items = itemsResult.rows.map(item => ({...item, productId: item.product_id, unitPrice: parseFloat(item.unit_price) }));
        }
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/purchase-orders', async (req, res) => {
    const { status, solicitante, date, supplierId, items } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const orderResult = await client.query('INSERT INTO purchase_orders (status, solicitante, date, supplier_id) VALUES ($1, $2, $3, $4) RETURNING *', [status, solicitante, date, supplierId]);
        const newOrder = orderResult.rows[0];

        for (const item of items) {
            await client.query('INSERT INTO purchase_order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)', [newOrder.id, item.productId, item.quantity, item.unitPrice]);
        }
        
        await client.query('COMMIT');
        newOrder.items = items;
        res.status(201).json(newOrder);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// REQUISIÇÕES INTERNAS
app.get('/api/internal-requisitions', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM internal_requisitions ORDER BY date DESC, id DESC');
        for (const req of rows) {
            const itemsResult = await pool.query('SELECT * FROM internal_requisition_items WHERE requisition_id = $1', [req.id]);
            req.items = itemsResult.rows.map(item => ({...item, productId: item.product_id}));
        }
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/internal-requisitions', async (req, res) => {
    const { solicitante, setor, costCenterId, date, status, items, justificativa } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const requisitionResult = await client.query('INSERT INTO internal_requisitions (solicitante, setor, cost_center_id, date, status, justificativa) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [solicitante, setor, costCenterId, date, status, justificativa]);
        const newRequisition = requisitionResult.rows[0];

        for (const item of items) {
            await client.query('INSERT INTO internal_requisition_items (requisition_id, product_id, quantity) VALUES ($1, $2, $3)', [newRequisition.id, item.productId, item.quantity]);
        }
        
        await client.query('COMMIT');
        newRequisition.items = items;
        res.status(201).json(newRequisition);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});


app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
});
