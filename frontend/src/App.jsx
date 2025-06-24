import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Settings,
  Bell,
  ArrowLeft,
  MoreVertical,
  LogOut,
  Download,
  Briefcase,
  TrendingUp,
  Landmark,
  ShieldCheck,
  ClipboardList,
  ArrowRightLeft,
  Percent,
  Loader,
  AlertTriangle,
  FileDown,
  BarChart3,
} from 'lucide-react';

// Para a funcionalidade de PDF, as seguintes bibliotecas são necessárias.
// Elas devem ser adicionadas ao seu index.html:
// <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
// <script src="https://unpkg.com/jspdf-autotable@3.5.23/dist/jspdf.plugin.autotable.js"></script>

// --- DADOS DE DEMONSTRAÇÃO (FALLBACK) ---
// const MOCK_DATA = {
//     products: [
//       { id: 1, internalCode: 'ATB-001', barcode: '789000000001', name: 'Amoxicilina 500mg', description: 'Caixa com 30 comprimidos', unit: 'CX', minStock: 50, idealStock: 150, currentStock: 80, itemType: 'Medicamento', category: 'Antibióticos', location: 'A1-01', manufacturer: 'Farmaco', expiryDate: '2025-07-31', lot: 'LOTE2024A', avgCost: 25.50, lastPurchasePrice: 26.00, status: 'Ativo' },
//       { id: 2, internalCode: 'CONS-015', barcode: '789000000002', name: 'Seringa Descartável 5ml', description: 'Pacote com 100 unidades', unit: 'PCT', minStock: 200, idealStock: 500, currentStock: 350, itemType: 'Consumo', category: 'Materiais Descartáveis', location: 'B2-05', manufacturer: 'MedEquip', expiryDate: '2026-05-31', lot: 'LOTE2024B', avgCost: 15.00, lastPurchasePrice: 14.80, status: 'Ativo' },
//       { id: 3, internalCode: 'ESCR-003', name: 'Papel A4', unit: 'RM', minStock: 20, currentStock: 15, avgCost: 22.00, status: 'Ativo', category: 'Material de Escritório', expiryDate: null, lot: null },
//     ],
//     suppliers: [
//       { id: 1, name: 'Distribuidora MedFarma Ltda.', cnpj: '11.222.333/0001-44', email: 'contato@medfarma.com', phone: '(11) 98765-4321', category: 'Medicamentos' },
//       { id: 2, name: 'Suprimentos Hospitalares S.A.', cnpj: '44.555.666/0001-77', email: 'vendas@suprimentos.com', phone: '(21) 91234-5678', category: 'Materiais Descartáveis' },
//       { id: 4, name: 'InfraTech Soluções', cnpj: '12.345.678/0001-99', email: 'contato@infratech.com', phone: '(41) 98888-7777', category: 'Serviços de TI' },
//     ],
//     costCenters: [ { id: 1, name: 'Administrativo' }, { id: 2, name: 'Raio-X' }, { id: 3, name: 'Enfermagem' }, { id: 4, name: 'TI' }, { id: 5, name: 'Manutenção' }, { id: 99, name: 'Custos Partilhados'} ],
//     paymentRepositories: [ { id: 1, name: 'Caixa Principal' }, { id: 2, name: 'Conta Corrente Santander' }, { id: 3, name: 'Conta Corrente Sicredi' }],
//     expenseCategories: [ { id: 1, name: 'Fornecedores' }, { id: 2, name: 'Folha de Pagamento' }, { id: 3, name: 'Infraestrutura' }, { id: 4, name: 'Marketing' }, { id: 5, name: 'Impostos' }],
//     revenueSources: [ { id: 1, name: 'Venda de Serviços' }, { id: 2, name: 'Venda de Produtos' }, { id: 3, name: 'Aluguel de Equipamentos' }, { id: 4, 'name': 'Outros' }],
//     productUnits: [ {id: 1, name: 'UN'}, {id: 2, name: 'CX'}, {id: 3, name: 'PCT'}, {id: 4, name: 'RM'}, {id: 5, name: 'FR'} ],
//     productItemTypes: [ {id: 1, name: 'Produto'}, {id: 2, name: 'Matéria-prima'}, {id: 3, name: 'Consumo'}, {id: 4, name: 'Imobilizado'}, {id: 5, name: 'Medicamento'} ],
//     movements: [
//       { id: 1, type: 'entrada', productId: 1, quantity: 50, date: '2024-07-10', unitPrice: 26.00, responsible: 'Ana Paula' },
//       { id: 2, type: 'saida', productId: 2, quantity: 10, date: '2024-07-12', costCenterId: 3, responsible: 'Carlos Dias', justification: 'Uso rotineiro na ala C' },
//       { id: 3, type: 'saida', productId: 3, quantity: 10, date: '2024-07-13', costCenterId: 99, responsible: 'Carlos Dias', justification: 'Uso compartilhado' },
//       { id: 4, type: 'saida', productId: 1, quantity: 20, date: '2024-07-14', costCenterId: 2, responsible: 'Maria Souza', justification: 'Uso no Raio-X' },
//       { id: 5, type: 'adjustment', productId: 3, quantity: 5, date: '2024-07-15', responsible: 'Admin', justification: 'Ajuste de inventário (complemento)'},
//       { id: 6, type: 'adjustment', productId: 2, quantity: -2, date: '2024-07-16', responsible: 'Admin', justification: 'Ajuste de inventário (estorno)'},
//     ],
//     purchaseOrders: [
//         { id: 1, status: 'Recebido', solicitante: 'João Silva', date: '2024-04-25', items: [{ productId: 1, quantity: 50, unitPrice: 26.00 }], supplierId: 1 },
//         { id: 2, status: 'Aprovado', solicitante: 'Mariana Lima', date: '2024-05-18', items: [{ productId: 3, quantity: 30, unitPrice: 22.50 }], supplierId: 2 },
//     ],
//     expenses: [
//         { id: 1, description: 'Pagamento de fornecedor - Material de Limpeza', totalValue: 1250.60, paymentDate: '2024-07-10', supplierId: 2, categoryId: 1, costCenterId: 5, status: 'Pago', repositoryId: 2, allocation: 'Centro de Custo' },
//         { id: 2, description: 'Serviço de consultoria de TI', totalValue: 3500.00, paymentDate: null, supplierId: 4, categoryId: 3, costCenterId: 4, status: 'Aguardando', dueDate: '2024-07-15', allocation: 'Centro de Custo' },
//     ],
//     revenues: [ { id: 1, description: 'Consulta Dr. House', value: 450.00, date: '2024-07-10', repositoryId: 2, sourceId: 1, type: 'Serviço', status: 'Recebido'}, { id: 2, description: 'Venda de kit de primeiros socorros', value: 75.50, date: '2024-07-11', repositoryId: 1, sourceId: 2, type: 'Produto', status: 'Recebido'}, ],
//     invoicings: [ { id: 1, description: "Faturamento Serviços Enfermagem", value: 150000, date: '2024-07-30', type: 'Real', costCenterId: 3 }, ],
//     cashMovements: [ { id: 1, type: 'Crédito', value: 10000, date: '2024-07-01', repositoryId: 2, description: 'Aporte inicial' }, ],
//     users: [ { id: 1, name: 'Admin Geral', email: 'admin@erp.com', groupId: 1 }, { id: 2, name: 'User Estoque', email: 'estoque@erp.com', groupId: 2 } ],
//     groups: [ { id: 1, name: 'Administradores' }, { id: 2, name: 'Equipe de Estoque' } ],
//     internalRequisitions: [
//         { id: 1, solicitante: 'Enf. Maria', setor: 'Ala A', costCenterId: 3, date: '2024-07-12', status: 'Atendido', items: [{ productId: 2, quantity: 20 }], justificativa: 'Reposição' },
//         { id: 2, solicitante: 'Dr. House', setor: 'Consultório', costCenterId: 3, date: '2024-07-18', status: 'Aprovado', items: [{ productId: 1, quantity: 5 }], justificativa: 'Uso em paciente' },
//     ],
//     allocationRules: [ { costCenterId: 1, percentage: 10 }, { costCenterId: 2, percentage: 25 } ],
//     groupPermissions: { 1: { products: ['view', 'create', 'edit', 'delete'], suppliers: ['view', 'create', 'edit', 'delete']}, 2: { products: ['view'], suppliers: ['view'] } }
// };

// --- COMPONENTES AUXILIARES ---
const Card = ({ children, className }) => (
  <div className={`rounded-lg bg-white p-6 shadow-md ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => <div className="mb-4 border-b pb-4">{children}</div>;
const CardTitle = ({ children }) => (
  <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">{children}</h3>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gray-100 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
const Button = ({
  children,
  onClick,
  className = 'bg-blue-600 hover:bg-blue-700 text-white',
  type = 'button',
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold shadow-sm transition-all duration-200 ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
  >
    {children}
  </button>
);
const getStatusChip = (status) => {
  switch (status) {
    case 'Pago':
    case 'Recebido':
    case 'Atendido':
      return 'bg-green-100 text-green-800';
    case 'Aguardando':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pendente':
      return 'bg-orange-100 text-orange-800';
    case 'Cancelado':
    case 'Rejeitado':
      return 'bg-red-100 text-red-800';
    case 'Solicitado':
      return 'bg-blue-100 text-blue-800';
    case 'Aprovado':
      return 'bg-purple-100 text-purple-800';
    case 'Comprado':
      return 'bg-indigo-100 text-indigo-800';
    case 'Ativo':
      return 'bg-green-100 text-green-800';
    case 'Inativo':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
const LoadingSpinner = () => (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <Loader size={48} className="animate-spin text-blue-600" />
    <p className="mt-4 text-lg text-gray-600">Carregando dados da API...</p>
  </div>
);
const ApiError = ({ message }) => (
  <div
    className="mb-6 rounded-md border-l-4 border-red-500 bg-red-100 p-4 text-red-800 shadow-md"
    role="alert"
  >
    <div className="flex">
      <div className="py-1">
        <AlertTriangle className="mr-4 h-6 w-6 text-red-500" />
      </div>
      <div>
        <p className="font-bold">Erro de Conexão com a API</p>
        <p>{message}</p>
      </div>
    </div>
  </div>
);

// --- PÁGINAS DO SISTEMA (Componentes principais) ---
const Dashboard = ({ products, movements, purchaseOrders, costCenters }) => {
  const lowStockItems = products.filter((p) => p.currentStock < p.minStock).length;
  const expiringSoonItems = products.filter((p) => {
    if (!p.expiryDate) return false;
    const diff = new Date(p.expiryDate).getTime() - new Date().getTime();
    return diff / (1000 * 3600 * 24) <= 30 && diff > 0;
  }).length;
  const pendingPurchaseOrders = purchaseOrders.filter(
    (po) => po.status === 'Solicitado' || po.status === 'Aprovado'
  ).length;
  const costByCenterData = useMemo(() => {
    const costs = {};
    costCenters.forEach((cc) => {
      costs[cc.name] = 0;
    });
    movements
      .filter((m) => m.type === 'saida' && m.costCenterId)
      .forEach((m) => {
        const product = products.find((p) => p.id === m.productId);
        const costCenter = costCenters.find((cc) => cc.id === m.costCenterId);
        if (product && costCenter) {
          costs[costCenter.name] += m.quantity * product.avgCost;
        }
      });
    return Object.entries(costs).map(([name, value]) => ({
      name,
      Custo: parseFloat(value.toFixed(2)),
    }));
  }, [movements, products, costCenters]);
  const consumptionByCategoryData = useMemo(() => {
    const consumption = {};
    movements
      .filter((m) => m.type === 'saida')
      .forEach((m) => {
        const product = products.find((p) => p.id === m.productId);
        if (product && product.category) {
          if (!consumption[product.category]) {
            consumption[product.category] = 0;
          }
          consumption[product.category] += m.quantity * product.avgCost;
        }
      });
    return Object.entries(consumption)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [movements, products]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Dashboard Geral</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex transform items-center justify-between rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-gray-500">Valor Total do Estoque</p>
            <p className="text-3xl font-bold text-gray-800">{`R$ ${products.reduce((acc, p) => acc + (p.currentStock || 0) * (p.avgCost || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>
          </div>
          <div className={`rounded-full bg-green-500 p-3`}>
            <DollarSign size={24} className="text-white" />
          </div>
        </div>
        <div className="flex transform items-center justify-between rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-gray-500">Itens com Estoque Baixo</p>
            <p className="text-3xl font-bold text-gray-800">{lowStockItems}</p>
          </div>
          <div className={`rounded-full bg-red-500 p-3`}>
            <Bell size={24} className="text-white" />
          </div>
        </div>
        <div className="flex transform items-center justify-between rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-gray-500">Pedidos Pendentes</p>
            <p className="text-3xl font-bold text-gray-800">{pendingPurchaseOrders}</p>
          </div>
          <div className={`rounded-full bg-yellow-500 p-3`}>
            <ShoppingCart size={24} className="text-white" />
          </div>
        </div>
        <div className="flex transform items-center justify-between rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-gray-500">Itens a Vencer (30 dias)</p>
            <p className="text-3xl font-bold text-gray-800">{expiringSoonItems}</p>
          </div>
          <div className={`rounded-full bg-orange-500 p-3`}>
            <Bell size={24} className="text-white" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Custo por Centro de Custo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costByCenterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
                <Bar dataKey="Custo" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consumo por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consumptionByCategoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {consumptionByCategoryData.map((e, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
const ProductForm = ({ product, onSave, onCancel, productUnits, productItemTypes }) => {
  const [formData, setFormData] = useState(
    product || {
      internalCode: '',
      name: '',
      description: '',
      unit: 'UN',
      minStock: 0,
      idealStock: 0,
      currentStock: 0,
      itemType: 'Consumo',
      category: '',
      location: '',
      manufacturer: '',
      expiryDate: '',
      lot: '',
      avgCost: 0,
      lastPurchasePrice: 0,
      status: 'Ativo',
    }
  );
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Ativo' : 'Inativo') : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome do Produto"
          className="w-full rounded-lg border p-2"
          required
        />
        <input
          name="internalCode"
          value={formData.internalCode}
          onChange={handleChange}
          placeholder="Código Interno"
          className="w-full rounded-lg border p-2"
        />
      </div>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição Detalhada"
        className="w-full rounded-lg border p-2"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
        >
          {productUnits.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          name="itemType"
          value={formData.itemType}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
        >
          {productItemTypes.map((it) => (
            <option key={it.id} value={it.name}>
              {it.name}
            </option>
          ))}
        </select>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Categoria"
          className="w-full rounded-lg border p-2"
        />
        <input
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          placeholder="Fabricante"
          className="w-full rounded-lg border p-2"
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">Salvar Produto</Button>
      </div>
    </form>
  );
};
const ProductsPage = ({ products, onSave, onDelete, productUnits, productItemTypes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSaveProduct = (data) => {
    onSave(data);
    closeModal();
  };
  const openModal = (p = null) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };
  const handleDeleteProduct = (id) => {
    if (window.confirm('Tem certeza?')) {
      onDelete(id);
    }
  };
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Produtos</h2>
        <Button onClick={() => openModal()}>
          <PlusCircle size={20} /> Novo
        </Button>
      </div>
      <div className="mb-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar..."
          className="w-full rounded-lg border p-2"
        />
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Status</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.status}</td>
                <td className="flex gap-2 p-2">
                  <Button onClick={() => openModal(p)} className="p-1 text-xs">
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="bg-red-600 p-1 text-xs"
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
      >
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={closeModal}
          productUnits={productUnits}
          productItemTypes={productItemTypes}
        />
      </Modal>
    </div>
  );
};
const StockMovementForm = ({ type, products, onSave, onCancel, costCenters }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [costCenterId, setCostCenterId] = useState('');
  const [justification, setJustification] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const selectedProduct = products.find((p) => p.id === parseInt(productId));
  const maxQuantity = selectedProduct ? selectedProduct.currentStock : 0;
  const handleSubmit = (e) => {
    e.preventDefault();
    const movementData = {
      type,
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      date: new Date().toISOString().split('T')[0],
      responsible: 'Usuário Logado',
    };
    if (type === 'saida') {
      movementData.costCenterId = parseInt(costCenterId);
      movementData.justification = justification;
    } else {
      movementData.unitPrice = parseFloat(unitPrice);
    }
    onSave(movementData);
  };
  useEffect(() => {
    if (type === 'entrada' && selectedProduct) setUnitPrice(selectedProduct.lastPurchasePrice);
  }, [productId, type, selectedProduct]);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block font-semibold">Produto</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-lg border p-2"
          required
        >
          <option value="">Selecione...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.currentStock} {p.unit})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block font-semibold">Quantidade</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          max={type === 'saida' ? maxQuantity : undefined}
          className="w-full rounded-lg border p-2"
          required
        />
        {type === 'saida' && selectedProduct && (
          <p className="mt-1 text-sm text-gray-500">Disponível: {maxQuantity}</p>
        )}
      </div>
      {type === 'entrada' && (
        <div>
          <label className="mb-1 block font-semibold">Preço Unitário</label>
          <input
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full rounded-lg border p-2"
            required
          />
        </div>
      )}
      {type === 'saida' && (
        <>
          <div>
            <label className="mb-1 block font-semibold">Centro de Custo</label>
            <select
              value={costCenterId}
              onChange={(e) => setCostCenterId(e.target.value)}
              className="w-full rounded-lg border p-2"
              required
            >
              <option value="">Selecione...</option>
              {costCenters.map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-semibold">Justificativa</label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
        </>
      )}
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">
          {type === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
        </Button>
      </div>
    </form>
  );
};
const StockMovementsPage = ({ movements, onSave, products, costCenters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('entrada');
  const handleSaveMovement = (movementData) => {
    onSave(movementData);
    closeModal();
  };
  const openModal = (type) => {
    setMovementType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const getProductInfo = useCallback((id) => products.find((p) => p.id === id), [products]);
  const getCostCenterInfo = (id) => costCenters.find((cc) => cc.id === id);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Movimentações de Estoque</h2>
        <div className="flex gap-4">
          <Button
            onClick={() => openModal('entrada')}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <PlusCircle size={20} /> Nova Entrada
          </Button>
          <Button
            onClick={() => openModal('saida')}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <PlusCircle size={20} /> Nova Saída
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <ul className="divide-y divide-gray-200">
          {movements.map((m) => {
            const p = getProductInfo(m.productId);
            const cc = m.costCenterId ? getCostCenterInfo(m.costCenterId) : null;
            const isEntry = m.type === 'entrada';
            return (
              <li
                key={m.id}
                className="flex flex-col items-start justify-between p-4 hover:bg-gray-50 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-3 rounded ${isEntry ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <div>
                    <p className="font-bold text-gray-800">{p?.name || 'Produto n/e'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(m.date).toLocaleDateString('pt-BR')} - Resp: {m.responsible}
                    </p>
                    {cc && <p className="text-sm text-gray-500">CC: {cc.name}</p>}
                    {m.justification && (
                      <p className="text-sm text-gray-500 italic">"{m.justification}"</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-right sm:mt-0">
                  <p className={`text-lg font-bold ${isEntry ? 'text-green-600' : 'text-red-600'}`}>
                    {isEntry ? '+' : '-'} {m.quantity} {p?.unit}
                  </p>
                  {isEntry && (
                    <p className="text-sm text-gray-500">@ R$ {m.unitPrice.toFixed(2)}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={movementType === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
      >
        <StockMovementForm
          type={movementType}
          products={products}
          onSave={handleSaveMovement}
          onCancel={closeModal}
          costCenters={costCenters}
        />
      </Modal>
    </div>
  );
};
const PurchaseOrderForm = ({ order, products, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    order || {
      solicitante: 'Usuário Logado',
      date: new Date().toISOString().split('T')[0],
      status: 'Solicitado',
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    }
  );
  const handleHeaderChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    const product = products.find((p) => p.id === parseInt(value));
    if (field === 'productId') {
      newItems[index].productId = value;
      newItems[index].unitPrice = product ? product.lastPurchasePrice : 0;
    } else {
      newItems[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, items: newItems }));
  };
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, unitPrice: 0 }],
    }));
  };
  const removeItem = (index) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  const total = useMemo(
    () => formData.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
    [formData.items]
  );
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border bg-white p-4">
        <h4 className="mb-4 text-lg font-semibold">Cabeçalho do Pedido</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="solicitante"
            value={formData.solicitante}
            onChange={handleHeaderChange}
            placeholder="Solicitante"
            className="w-full rounded-lg border p-2"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleHeaderChange}
            className="w-full rounded-lg border p-2"
          />
        </div>
      </div>
      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Itens do Pedido</h4>
          <Button
            type="button"
            onClick={addItem}
            className="bg-green-600 text-sm hover:bg-green-700"
          >
            <PlusCircle size={18} />
            Adicionar Item
          </Button>
        </div>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 items-center gap-2 border-b pb-2">
            <div className="col-span-6">
              <label className="text-xs">Produto</label>
              <select
                value={item.productId}
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                className="w-full rounded-lg border p-2"
                required
              >
                <option value="">Selecione...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs">Qtd.</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                min="1"
                className="w-full rounded-lg border p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs">Preço Unit.</label>
              <input
                type="number"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>
            <div className="col-span-1">
              <label className="text-xs">Total</label>
              <p className="p-2">{(item.quantity * item.unitPrice).toFixed(2)}</p>
            </div>
            <div className="col-span-1 flex items-end">
              <Button
                type="button"
                onClick={() => removeItem(index)}
                className="h-10 w-10 bg-red-500 p-2 hover:bg-red-600"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
        <div className="mt-4 text-right text-xl font-bold">
          Total do Pedido: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">Salvar Pedido</Button>
      </div>
    </form>
  );
};
const PurchaseOrdersPage = ({ purchaseOrders, onSave, products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSaveOrder = (orderData) => {
    onSave(orderData);
    closeModal();
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Pedidos de Compra</h2>
        <Button onClick={openModal}>
          <PlusCircle size={20} /> Novo Pedido
        </Button>
      </div>
      <div className="space-y-4">
        {purchaseOrders.map((po) => (
          <div
            key={po.id}
            className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  Pedido #{String(po.id).padStart(4, '0')}
                </p>
                <p className="text-sm text-gray-500">
                  Solicitante: {po.solicitante} | Data:{' '}
                  {new Date(po.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusChip(po.status)}`}
                >
                  {po.status}
                </span>
                <Button className="bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <h4 className="mb-2 font-semibold text-gray-600">Itens:</h4>
              <ul className="space-y-1">
                {po.items.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <li key={index} className="flex justify-between text-sm text-gray-700">
                      <span>{product?.name || 'Item desconhecido'}</span>
                      <span>
                        {item.quantity} x R$ {item.unitPrice.toFixed(2)} = R${' '}
                        {(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Novo Pedido de Compra">
        <PurchaseOrderForm products={products} onSave={handleSaveOrder} onCancel={closeModal} />
      </Modal>
    </div>
  );
};
const SupplierForm = ({ supplier, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    supplier || { name: '', cnpj: '', email: '', phone: '', category: '' }
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome / Razão Social"
        className="w-full rounded-lg border p-2"
        required
      />
      <input
        name="cnpj"
        value={formData.cnpj}
        onChange={handleChange}
        placeholder="CNPJ / CPF"
        className="w-full rounded-lg border p-2"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail"
          className="w-full rounded-lg border p-2"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Telefone"
          className="w-full rounded-lg border p-2"
        />
      </div>
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Categoria de Fornecimento"
        className="w-full rounded-lg border p-2"
      />
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};
const SuppliersPage = ({ suppliers, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSaveSupplier = (data) => {
    onSave(editingSupplier ? { ...data, id: editingSupplier.id } : data);
    closeModal();
  };
  const openModal = (s = null) => {
    setEditingSupplier(s);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(false);
  };
  const handleDeleteSupplier = (id) => {
    if (window.confirm('Tem certeza?')) {
      onDelete(id);
    }
  };
  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.cnpj && s.cnpj.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Fornecedores</h2>
        <Button onClick={() => openModal()}>
          <PlusCircle size={20} /> Novo Fornecedor
        </Button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          className="w-full rounded-lg border p-2 pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                CNPJ
              </th>
              <th scope="col" className="px-6 py-3">
                Contato
              </th>
              <th scope="col" className="px-6 py-3">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="border-b bg-white hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4">{s.cnpj}</td>
                <td className="px-6 py-4">
                  {s.email}
                  <br />
                  {s.phone}
                </td>
                <td className="px-6 py-4">{s.category}</td>
                <td className="flex items-center gap-2 px-6 py-4">
                  <button onClick={() => openModal(s)} className="text-blue-600">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      >
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
const ExpenseForm = ({
  expense,
  onSave,
  onCancel,
  suppliers,
  categories,
  costCenters,
  paymentSources,
}) => {
  const [formData, setFormData] = useState(
    expense || {
      description: '',
      launchType: 'Ambos',
      allocation: 'Centro de Custo',
      totalValue: '',
      paymentDate: '',
      supplierId: '',
      categoryId: '',
      costCenterId: '',
      paymentSourceId: '',
      paymentMethod: 'PIX',
      installments: 1,
      dueDate: '',
      competenceDate: new Date().toISOString().split('T')[0],
      status: 'Aguardando',
      invoiceNumber: '',
    }
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      totalValue: parseFloat(formData.totalValue),
      installments: parseInt(formData.installments),
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border bg-white p-4">
        <h4 className="mb-4 text-lg font-semibold text-gray-700">Informações da Despesa</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição da Despesa"
            className="col-span-2 w-full rounded-lg border p-2"
            required
          />
          <div>
            <label className="text-sm font-medium text-gray-600">Tipo de Lançamento</label>
            <select
              name="launchType"
              value={formData.launchType}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
              required
            >
              <option value="DRE">DRE</option>
              <option value="Fluxo de Caixa">Fluxo de Caixa</option>
              <option value="Ambos">Ambos</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Alocação</label>
            <select
              name="allocation"
              value={formData.allocation}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
              required
            >
              <option value="Estoque">Estoque</option>
              <option value="Centro de Custo">Centro de Custo</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Categoria</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Selecione...</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Centro de Custo</label>
            <select
              name="costCenterId"
              value={formData.costCenterId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Selecione...</option>
              {(costCenters || []).map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Fornecedor</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Selecione...</option>
              {(suppliers || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <input
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="Número da Nota Fiscal"
            className="w-full rounded-lg border p-2"
          />
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <h4 className="mb-4 text-lg font-semibold text-gray-700">Detalhes Financeiros</h4>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Valor Total (R$)</label>
            <input
              type="number"
              step="0.01"
              name="totalValue"
              value={formData.totalValue}
              onChange={handleChange}
              placeholder="0,00"
              className="mt-1 w-full rounded-lg border p-2"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Método</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option>Dinheiro</option>
              <option>PIX</option>
              <option>Cartão de Crédito</option>
              <option>Cartão de Débito</option>
              <option>Transferência</option>
              <option>Boleto</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Parcelas</label>
            <input
              type="number"
              name="installments"
              value={formData.installments}
              onChange={handleChange}
              min="1"
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
              required
            >
              <option>Aguardando</option>
              <option>Pago</option>
              <option>Pendente</option>
              <option>Cancelado</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Competência</label>
            <input
              type="date"
              name="competenceDate"
              value={formData.competenceDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Vencimento</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Pagamento</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Fonte</label>
            <select
              name="paymentSourceId"
              value={formData.paymentSourceId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="">Selecione...</option>
              {(paymentSources || []).map((ps) => (
                <option key={ps.id} value={ps.id}>
                  {ps.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">Salvar Despesa</Button>
      </div>
    </form>
  );
};
const ExpensesPage = ({
  expenses,
  onSave,
  onDelete,
  suppliers,
  expenseCategories,
  costCenters,
  paymentRepositories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSaveExpense = (data) => {
    onSave(editingExpense ? { ...data, id: editingExpense.id } : data);
    closeModal();
  };
  const openModal = (expense = null) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingExpense(null);
    setIsModalOpen(false);
  };
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza?')) {
      onDelete(id);
    }
  };
  const filteredExpenses = expenses.filter((e) =>
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const expensesByCategory = useMemo(() => {
    const data = {};
    expenseCategories.forEach((cat) => (data[cat.name] = 0));
    filteredExpenses.forEach((exp) => {
      const cat = expenseCategories.find((c) => c.id === exp.categoryId);
      if (cat) data[cat.name] += exp.totalValue;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .filter((i) => i.value > 0);
  }, [filteredExpenses, expenseCategories]);
  const expensesByStatus = useMemo(() => {
    const data = { Aguardando: 0, Pago: 0, Pendente: 0, Cancelado: 0 };
    filteredExpenses.forEach((exp) => {
      if (data.hasOwnProperty(exp.status)) data[exp.status] += exp.totalValue;
    });
    return Object.entries(data).map(([name, Custo]) => ({ name, Custo }));
  }, [filteredExpenses]);
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Módulo de Despesas</h2>
        <Button onClick={() => openModal()}>
          <PlusCircle size={20} /> Nova Despesa
        </Button>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                label
              >
                {expensesByCategory.map((e, i) => (
                  <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Despesas por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip
                formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              <Legend />
              <Bar dataKey="Custo" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por descrição..."
          className="w-full rounded-lg border p-2 pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3">Vencimento</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((e) => {
              const cat = expenseCategories.find((c) => c.id === e.categoryId);
              return (
                <tr key={e.id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{e.description}</td>
                  <td className="px-6 py-4">
                    R$ {e.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    {e.dueDate ? new Date(e.dueDate).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4">{cat?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusChip(e.status)}`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="flex items-center gap-2 px-6 py-4">
                    <button onClick={() => openModal(e)} className="text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={closeModal}
          suppliers={suppliers}
          categories={expenseCategories}
          costCenters={costCenters}
          paymentSources={paymentRepositories}
        />
      </Modal>
    </div>
  );
};
const UsersTab = ({ users, onSave, onDelete, groups }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const handleSaveUser = (userData) => {
    onSave(editingUser ? { ...userData, id: editingUser.id } : userData);
    closeModal();
  };
  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };
  const handleDeleteUser = (id) => {
    if (window.confirm('Tem certeza?')) {
      onDelete(id);
    }
  };
  const UserForm = ({ user, onSave, onCancel, groups }) => {
    const [formData, setFormData] = useState(user || { name: '', email: '', groupId: '' });
    const handleChange = (e) =>
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ ...formData, groupId: parseInt(formData.groupId) });
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome completo"
          className="w-full rounded-lg border p-2"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail"
          className="w-full rounded-lg border p-2"
          required
        />
        <select
          name="groupId"
          value={formData.groupId}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          required
        >
          <option value="">Selecione um grupo</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-4 pt-4">
          <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    );
  };
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Usuários do Sistema</h3>
        <Button onClick={() => openModal()}>
          <PlusCircle size={18} /> Novo Usuário
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Grupo</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const group = groups.find((g) => g.id === u.groupId);
              return (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="mr-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {group?.name || 'Sem grupo'}
                    </span>
                  </td>
                  <td className="flex gap-2 px-6 py-4">
                    <button onClick={() => openModal(u)} className="text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={closeModal}
          groups={groups}
        />
      </Modal>
    </div>
  );
};
const PermissionsTab = ({ groups, groupPermissions, setGroupPermissions }) => {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || null);
  const handlePermissionChange = (resource, action) => {
    setGroupPermissions((prev) => {
      const newPermissions = JSON.parse(JSON.stringify(prev));
      const groupActions = newPermissions[selectedGroupId]?.[resource] || [];
      if (groupActions.includes(action)) {
        newPermissions[selectedGroupId][resource] = groupActions.filter((a) => a !== action);
      } else {
        newPermissions[selectedGroupId][resource] = [...groupActions, action];
      }
      return newPermissions;
    });
  };
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-full md:w-1/4">
        <h3 className="mb-4 text-xl font-semibold">Grupos</h3>
        <ul className="space-y-2">
          {groups.map((g) => (
            <li
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`cursor-pointer rounded-lg p-3 ${selectedGroupId === g.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'}`}
            >
              {g.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-3/4">
        <h3 className="mb-4 text-xl font-semibold">
          Permissões para:{' '}
          <span className="text-blue-600">
            {groups.find((g) => g.id === selectedGroupId)?.name}
          </span>
        </h3>
        <div className="space-y-4 rounded-lg bg-white p-4 shadow-md">
          {Object.entries({
            products: { name: 'Produtos', actions: ['view', 'create', 'edit', 'delete'] },
            suppliers: { name: 'Fornecedores', actions: ['view', 'create', 'edit', 'delete'] },
          }).map(([resourceKey, resource]) => (
            <div key={resourceKey} className="border-b pb-4">
              <h4 className="mb-2 text-lg font-semibold">{resource.name}</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {resource.actions.map((action) => {
                  const hasPermission =
                    groupPermissions[selectedGroupId]?.[resourceKey]?.includes(action);
                  return (
                    <label
                      key={action}
                      className="flex cursor-pointer items-center gap-2 capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={!!hasPermission}
                        onChange={() => handlePermissionChange(resourceKey, action)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {action}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const GeneralRegistersTab = ({
  costCenters,
  setCostCenters,
  expenseCategories,
  setExpenseCategories,
  paymentRepositories,
  setPaymentRepositories,
  revenueSources,
  setRevenueSources,
  productUnits,
  setProductUnits,
  productItemTypes,
  setProductItemTypes,
  allocationRules,
  setAllocationRules,
}) => {
  const GenericRegisterCrud = ({ title, items, setItems, placeholder }) => {
    const [newItemName, setNewItemName] = useState('');
    const handleAddItem = () => {
      if (newItemName.trim()) {
        setItems((prev) => [...prev, { id: Date.now(), name: newItemName.trim() }]);
        setNewItemName('');
      }
    };
    const handleDeleteItem = (id) => {
      if (window.confirm('Tem certeza?')) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    };
    return (
      <div>
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        <div className="space-y-2 rounded-lg bg-white p-4 shadow-md">
          <ul className="max-h-48 divide-y overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-2">
                <span>{item.name}</span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t pt-2">
            <input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border p-2"
            />
            <Button onClick={handleAddItem}>
              <PlusCircle size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <GenericRegisterCrud
        title="Centros de Custo"
        items={costCenters.filter((c) => c.id !== 99)}
        setItems={setCostCenters}
        placeholder="Novo centro de custo"
      />
      <GenericRegisterCrud
        title="Categorias de Despesa"
        items={expenseCategories}
        setItems={setExpenseCategories}
        placeholder="Nova categoria"
      />
      <GenericRegisterCrud
        title="Repositórios de Caixa"
        items={paymentRepositories}
        setItems={setPaymentRepositories}
        placeholder="Novo repositório"
      />
      <GenericRegisterCrud
        title="Fontes de Receita"
        items={revenueSources}
        setItems={setRevenueSources}
        placeholder="Nova fonte de receita"
      />
      <GenericRegisterCrud
        title="Unidades de Medida (Produto)"
        items={productUnits}
        setItems={setProductUnits}
        placeholder="Nova unidade"
      />
      <GenericRegisterCrud
        title="Tipos de Item (Produto)"
        items={productItemTypes}
        setItems={setProductItemTypes}
        placeholder="Novo tipo de item"
      />
    </div>
  );
};
const SettingsPage = ({
  users,
  onSaveUser,
  onDeleteUser,
  groups,
  groupPermissions,
  setGroupPermissions,
  costCenters,
  setCostCenters,
  expenseCategories,
  setExpenseCategories,
  paymentRepositories,
  setPaymentRepositories,
  revenueSources,
  setRevenueSources,
  productUnits,
  setProductUnits,
  productItemTypes,
  setProductItemTypes,
  allocationRules,
  setAllocationRules,
}) => {
  const [activeTab, setActiveTab] = useState('permissions');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UsersTab users={users} onSave={onSaveUser} onDelete={onDeleteUser} groups={groups} />
        );
      case 'permissions':
        return (
          <PermissionsTab
            groups={groups}
            groupPermissions={groupPermissions}
            setGroupPermissions={setGroupPermissions}
          />
        );
      case 'registers':
        return (
          <GeneralRegistersTab
            costCenters={costCenters}
            setCostCenters={setCostCenters}
            expenseCategories={expenseCategories}
            setExpenseCategories={setExpenseCategories}
            paymentRepositories={paymentRepositories}
            setPaymentRepositories={setPaymentRepositories}
            revenueSources={revenueSources}
            setRevenueSources={setRevenueSources}
            productUnits={productUnits}
            setProductUnits={setProductItemTypes}
            productItemTypes={productItemTypes}
            setAllocationRules={setAllocationRules}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Configurações e Cadastros</h2>
      <div className="mb-6 flex border-b">
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 font-semibold ${activeTab === 'permissions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Grupos e Permissões
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Usuários
        </button>
        <button
          onClick={() => setActiveTab('registers')}
          className={`px-4 py-2 font-semibold ${activeTab === 'registers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Cadastros Gerais
        </button>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};
const RequisitionForm = ({ requisition, products, costCenters, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    requisition || {
      solicitante: '',
      setor: '',
      costCenterId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Solicitado',
      items: [{ productId: '', quantity: 1 }],
      justificativa: '',
    }
  );
  const handleHeaderChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };
  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, { productId: '', quantity: 1 }] }));
  };
  const removeItem = (index) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, costCenterId: parseInt(formData.costCenterId) });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 md:grid-cols-2">
        <input
          name="solicitante"
          value={formData.solicitante}
          onChange={handleHeaderChange}
          placeholder="Nome do Solicitante"
          className="w-full rounded-lg border p-2"
          required
        />
        <input
          name="setor"
          value={formData.setor}
          onChange={handleHeaderChange}
          placeholder="Setor Solicitante"
          className="w-full rounded-lg border p-2"
          required
        />
        <select
          name="costCenterId"
          value={formData.costCenterId}
          onChange={handleHeaderChange}
          className="w-full rounded-lg border p-2 md:col-span-2"
          required
        >
          <option value="">Selecione o Centro de Custo de destino</option>
          {costCenters.map((cc) => (
            <option key={cc.id} value={cc.id}>
              {cc.name}
            </option>
          ))}
        </select>
        <textarea
          name="justificativa"
          value={formData.justificativa}
          onChange={handleHeaderChange}
          placeholder="Justificativa da Requisição"
          className="w-full rounded-lg border p-2 md:col-span-2"
          rows="3"
          required
        />
      </div>
      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Itens Requisitados</h4>
          <Button
            type="button"
            onClick={addItem}
            className="bg-green-600 text-sm hover:bg-green-700"
          >
            <PlusCircle size={18} />
            Adicionar Item
          </Button>
        </div>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-10 items-center gap-2 border-b pb-2">
            <div className="col-span-7">
              <label className="text-xs">Produto</label>
              <select
                value={item.productId}
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                className="w-full rounded-lg border p-2"
                required
              >
                <option value="">Selecione...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs">Qtd.</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                min="1"
                className="w-full rounded-lg border p-2"
              />
            </div>
            <div className="col-span-1 flex items-end">
              <Button
                type="button"
                onClick={() => removeItem(index)}
                className="h-10 w-10 bg-red-500 p-2 hover:bg-red-600"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">Salvar Requisição</Button>
      </div>
    </form>
  );
};
const InternalRequisitionsPage = ({ requisitions, onSave, products, costCenters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSave = (data) => {
    onSave(data);
    closeModal();
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const updateStatus = (id, status) => {
    if (window.confirm(`Deseja alterar o status para ${status}?`)) onSave({ id, status });
  };
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Requisições Internas</h2>
        <Button onClick={openModal}>
          <PlusCircle size={20} /> Nova Requisição
        </Button>
      </div>
      <div className="space-y-4">
        {Array.isArray(requisitions) &&
          requisitions.map((r) => {
            const cc = costCenters.find((c) => c.id === r.costCenterId);
            return (
              <div
                key={r.id}
                className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-800">
                      Requisição #{String(r.id).padStart(4, '0')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Solicitante: {r.solicitante} ({r.setor}) | Data:{' '}
                      {new Date(r.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Centro de Custo: <span className="font-semibold">{cc?.name || 'N/A'}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusChip(r.status)}`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-4 border-t pt-4">
                  <h4 className="mb-2 font-semibold text-gray-600">Itens:</h4>
                  <ul className="list-inside list-disc space-y-1">
                    {r.items.map((item, index) => {
                      const p = products.find((prod) => prod.id == item.productId);
                      return (
                        <li key={index} className="text-sm text-gray-700">
                          {item.quantity}x {p?.name || 'Item desconhecido'}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Justificativa:</span> {r.justificativa}
                  </p>
                </div>
                {r.status === 'Solicitado' && (
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => updateStatus(r.id, 'Rejeitado')}
                      className="bg-red-500 text-xs hover:bg-red-600"
                    >
                      Rejeitar
                    </Button>
                    <Button
                      onClick={() => updateStatus(r.id, 'Aprovado')}
                      className="bg-green-500 text-xs hover:bg-green-600"
                    >
                      Aprovar
                    </Button>
                  </div>
                )}
                {r.status === 'Aprovado' && (
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => updateStatus(r.id, 'Atendido')}
                      className="bg-blue-500 text-xs hover:bg-blue-600"
                    >
                      Marcar como Atendido
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Nova Requisição de Material">
        <RequisitionForm
          products={products}
          costCenters={costCenters}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
const RevenueForm = ({ revenue, onSave, onCancel, repositories, sources }) => {
  const [formData, setFormData] = useState(
    revenue || {
      value: '',
      date: new Date().toISOString().split('T')[0],
      repositoryId: '',
      sourceId: '',
      type: 'Serviço',
      status: 'Aguardando',
      description: '',
    }
  );
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      value: parseFloat(formData.value),
      repositoryId: parseInt(formData.repositoryId),
      sourceId: parseInt(formData.sourceId),
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-600">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Data do Recebimento</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Repositório de Destino</label>
          <select
            name="repositoryId"
            value={formData.repositoryId}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
          >
            <option value="">Selecione...</option>
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Fonte Pagadora</label>
          <select
            name="sourceId"
            value={formData.sourceId}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
          >
            <option value="">Selecione...</option>
            {sources.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Tipo de Recebimento</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
          >
            <option>Serviço</option>
            <option>Produto</option>
            <option>Aluguel</option>
            <option>Outros</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
          >
            <option>Recebido</option>
            <option>Aguardando</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-600">Descrição</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border p-2"
          rows="3"
        ></textarea>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Cancelar
        </Button>
        <Button type="submit">Salvar Recebimento</Button>
      </div>
    </form>
  );
};
const RevenuesPage = ({ revenues, onSave, onDelete, repositories, sources }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState(null);
  const handleSave = (data) => {
    onSave(editingRevenue ? { ...data, id: editingRevenue.id } : data);
    closeModal();
  };
  const openModal = (revenue = null) => {
    setEditingRevenue(revenue);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingRevenue(null);
    setIsModalOpen(false);
  };
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza?')) {
      onDelete(id);
    }
  };
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Módulo de Recebimentos</h2>
        <Button onClick={() => openModal()}>
          <PlusCircle size={20} /> Novo Recebimento
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map((r) => (
              <tr key={r.id}>
                <td>{r.description}</td>
                <td>R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td>
                  <Button className="p-1 text-xs" onClick={() => openModal(r)}>
                    <Edit size={14} />
                  </Button>
                  <Button className="bg-red-600 p-1 text-xs" onClick={() => handleDelete(r.id)}>
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRevenue ? 'Editar Recebimento' : 'Novo Recebimento'}
      >
        <RevenueForm
          revenue={editingRevenue}
          onSave={handleSave}
          onCancel={closeModal}
          repositories={repositories}
          sources={sources}
        />
      </Modal>
    </div>
  );
};
const InvoicingForm = ({ invoicing, onSave, onCancel, costCenters }) => {
  const [formData, setFormData] = useState(
    invoicing || {
      value: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Competência',
      costCenterId: '',
      description: '',
    }
  );
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      value: parseFloat(formData.value),
      costCenterId: formData.costCenterId ? parseInt(formData.costCenterId) : null,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Data do Faturamento</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
          >
            <option>Competência</option>
            <option>Real</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Centro de Custo</label>
          <select
            name="costCenterId"
            value={formData.costCenterId}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-2"
          >
            <option value="">Nenhum</option>
            {costCenters.map((cc) => (
              <option key={cc.id} value={cc.id}>
                {cc.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Descrição</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border p-2"
          rows="3"
          required
        ></textarea>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button
          onClick={onCancel}
          type="button"
          className="bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Cancelar
        </Button>
        <Button type="submit">Salvar Faturamento</Button>
      </div>
    </form>
  );
};
const InvoicingPage = ({ invoicings, onSave, onDelete, costCenters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoicing, setEditingInvoicing] = useState(null);
  const handleSave = (data) => {
    onSave(editingInvoicing ? { ...data, id: editingInvoicing.id } : data);
    closeModal();
  };
  const openModal = (item = null) => {
    setEditingInvoicing(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingInvoicing(null);
    setIsModalOpen(false);
  };
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza?')) {
      onDelete(id);
    }
  };
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Módulo de Faturamento</h2>
        <Button onClick={() => openModal()}>
          <PlusCircle size={20} /> Novo Lançamento
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {invoicings.map((i) => (
              <tr key={i.id}>
                <td>{i.description}</td>
                <td>R$ {i.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>{i.date}</td>
                <td>{i.type}</td>
                <td>
                  <Button className="p-1 text-xs" onClick={() => openModal(i)}>
                    <Edit size={14} />
                  </Button>
                  <Button className="bg-red-600 p-1 text-xs" onClick={() => handleDelete(i.id)}>
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingInvoicing ? 'Editar Faturamento' : 'Novo Faturamento'}
      >
        <InvoicingForm
          invoicing={editingInvoicing}
          onSave={handleSave}
          onCancel={closeModal}
          costCenters={costCenters}
        />
      </Modal>
    </div>
  );
};
const CashMovementForm = ({ onSave, onCancel, repositories }) => {
  const [formData, setFormData] = useState({
    type: 'Crédito',
    value: '',
    repositoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      value: parseFloat(formData.value),
      repositoryId: parseInt(formData.repositoryId),
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
        >
          <option>Crédito</option>
          <option>Débito</option>
        </select>
        <input
          type="number"
          step="0.01"
          name="value"
          value={formData.value}
          onChange={handleChange}
          placeholder="Valor (R$)"
          className="w-full rounded-lg border p-2"
          required
        />
        <select
          name="repositoryId"
          value={formData.repositoryId}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          required
        >
          <option value="">Selecione o Repositório</option>
          {repositories.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          required
        />
      </div>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição da movimentação"
        className="w-full rounded-lg border p-2"
        rows="3"
        required
      ></textarea>
      <div className="flex justify-end gap-4 pt-4">
        <Button
          onClick={onCancel}
          type="button"
          className="bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};
const CashManagementPage = ({ movements, onSave, repositories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSave = (data) => {
    onSave(data);
    closeModal();
  };
  const closeModal = () => setIsModalOpen(false);
  const balances = useMemo(() => {
    const calculatedBalances = {};
    repositories.forEach((r) => (calculatedBalances[r.id] = 0));
    movements.forEach((m) => {
      if (m.type === 'Crédito') calculatedBalances[m.repositoryId] += m.value;
      else calculatedBalances[m.repositoryId] -= m.value;
    });
    return repositories.map((r) => ({ name: r.name, Saldo: calculatedBalances[r.id] || 0 }));
  }, [movements, repositories]);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Gestão de Caixa</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Nova Movimentação
        </Button>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Saldo por Repositório</h3>
          <ul className="space-y-3">
            {balances.map((b) => (
              <li
                key={b.name}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-lg"
              >
                <span>{b.name}</span>
                <span className={`font-bold ${b.Saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {b.Saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Posição de Caixa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balances}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              <Legend />
              <Bar dataKey="Saldo" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <h3 className="p-4 text-lg font-semibold text-gray-700">Últimas Movimentações</h3>
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Repositório</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => {
              const repo = repositories.find((r) => r.id === m.repositoryId);
              return (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-medium">{m.description}</td>
                  <td className="px-6 py-4">{repo?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${m.type === 'Crédito' ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-bold ${m.type === 'Crédito' ? 'text-green-600' : 'text-red-500'}`}
                  >
                    R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Nova Movimentação de Caixa">
        <CashMovementForm onSave={handleSave} onCancel={closeModal} repositories={repositories} />
      </Modal>
    </div>
  );
};
const CostCenterPage = ({
  costCenters,
  expenses,
  invoicings,
  allocationRules,
  setAllocationRules,
  movements,
  products,
}) => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const financialSummary = useMemo(() => {
    const summary = costCenters
      .filter((cc) => cc.id !== 99)
      .map((cc) => ({
        id: cc.id,
        name: cc.name,
        revenue: 0,
        directExpenses: 0,
        sharedExpenses: 0,
        stockConsumption: 0,
        transactions: [],
      }));
    invoicings.forEach((inv) => {
      const center = summary.find((s) => s.id === inv.costCenterId);
      if (center) {
        center.revenue += inv.value;
        center.transactions.push({
          type: 'Faturamento',
          description: inv.description,
          value: inv.value,
          date: inv.date,
        });
      }
    });
    expenses
      .filter((exp) => exp.allocation === 'Centro de Custo')
      .forEach((exp) => {
        if (exp.costCenterId === 99) {
          summary.forEach((center) => {
            const rule = allocationRules.find((r) => r.costCenterId === center.id);
            if (rule) {
              const allocatedValue = exp.totalValue * (rule.percentage / 100);
              center.sharedExpenses += allocatedValue;
              center.transactions.push({
                type: 'Despesa Partilhada',
                description: exp.description,
                value: -allocatedValue,
                date: exp.paymentDate || exp.dueDate,
              });
            }
          });
        } else {
          const center = summary.find((s) => s.id === exp.costCenterId);
          if (center) {
            center.directExpenses += exp.totalValue;
            center.transactions.push({
              type: 'Despesa Direta',
              description: exp.description,
              value: -exp.totalValue,
              date: exp.paymentDate || exp.dueDate,
            });
          }
        }
      });
    movements
      .filter((m) => m.type === 'saida')
      .forEach((mov) => {
        const product = products.find((p) => p.id === mov.productId);
        if (!product) return;
        const cost = mov.quantity * product.avgCost;
        if (mov.costCenterId === 99) {
          summary.forEach((center) => {
            const rule = allocationRules.find((r) => r.costCenterId === center.id);
            if (rule) {
              const allocatedValue = cost * (rule.percentage / 100);
              center.sharedExpenses += allocatedValue;
              center.transactions.push({
                type: 'Consumo Partilhado',
                description: `Consumo de ${product.name}`,
                value: -allocatedValue,
                date: mov.date,
              });
            }
          });
        } else {
          const center = summary.find((s) => s.id === mov.costCenterId);
          if (center) {
            center.directExpenses += cost;
            center.transactions.push({
              type: 'Consumo Direto',
              description: `Consumo de ${product.name}`,
              value: -cost,
              date: mov.date,
            });
          }
        }
      });
    return summary.map((s) => ({
      ...s,
      totalExpenses: s.directExpenses + s.sharedExpenses,
      result: s.revenue - (s.directExpenses + s.sharedExpenses),
    }));
  }, [costCenters, expenses, invoicings, allocationRules, movements, products]);
  const chartData = financialSummary.map((s) => ({
    name: s.name,
    Receita: s.revenue,
    Despesa: s.totalExpenses,
  }));
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Análise de Centros de Custo</h2>
      </div>
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          Receita vs. Despesa por Centro de Custo
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `R$${v / 1000}k`} />
            <Tooltip
              formatter={(v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
            <Legend />
            <Bar dataKey="Receita" fill="#34d399" />
            <Bar dataKey="Despesa" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Centro de Custo</th>
              <th className="p-3 text-right">Receitas</th>
              <th className="p-3 text-right">Despesas Diretas</th>
              <th className="p-3 text-right">Despesas Rateadas</th>
              <th className="p-3 text-right">Resultado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {financialSummary.map((s) => (
              <tr key={s.id} className="border-b hover:bg-blue-50">
                <td className="p-3 font-semibold">{s.name}</td>
                <td className="p-3 text-right text-green-600">
                  R$ {s.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-right text-red-600">
                  R$ {s.directExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-right text-red-500">
                  R$ {s.sharedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={`p-3 text-right font-bold ${s.result >= 0 ? 'text-green-700' : 'text-red-700'}`}
                >
                  R$ {s.result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3">
                  <Button onClick={() => setSelectedCenter(s)} className="px-2 py-1 text-xs">
                    Detalhes
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={!!selectedCenter}
        onClose={() => setSelectedCenter(null)}
        title={`Detalhes de: ${selectedCenter?.name}`}
      >
        {selectedCenter && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resumo Financeiro</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-green-100 p-4">
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {selectedCenter.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-4">
                <p className="text-sm text-gray-600">Despesa Total</p>
                <p className="text-2xl font-bold text-red-700">
                  R${' '}
                  {selectedCenter.totalExpenses.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div
                className={`rounded-lg p-4 ${selectedCenter.result >= 0 ? 'bg-green-200' : 'bg-red-200'}`}
              >
                <p className="text-sm text-gray-700">Resultado</p>
                <p
                  className={`text-2xl font-bold ${selectedCenter.result >= 0 ? 'text-green-800' : 'text-red-800'}`}
                >
                  R$ {selectedCenter.result.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <h3 className="border-t pt-4 text-lg font-bold">Transações</h3>
            <ul className="max-h-80 divide-y overflow-y-auto">
              {selectedCenter.transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((t, i) => (
                  <li key={i} className="flex justify-between p-2">
                    <div>
                      <p className="font-semibold">{t.description}</p>
                      <p className="text-xs text-gray-500">
                        {t.type} - {new Date(t.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className={`font-bold ${t.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.value < 0 && '- '}R${' '}
                      {Math.abs(t.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- ESTRUTURA DOS RELATÓRIOS ---
const ReportDisplay = ({ title, columns, data, filterControls, onGenerate, children }) => {
  const handleExportPDF = () => {
    if (data.length === 0 || typeof window.jspdf === 'undefined') {
      alert(
        'Gere um relatório antes de exportar ou verifique se a biblioteca jsPDF está carregada.'
      );
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const body = data.map((row) => columns.map((col) => row[col.dataKey]));
    doc.text(title, 14, 15);
    doc.autoTable({ head: [columns.map((col) => col.header)], body, startY: 20 });
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}.pdf`);
  };

  const jsonToXml = (json) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<report>\n';
    json.forEach((item) => {
      xml += '  <item>\n';
      for (const key in item) {
        if (
          Object.prototype.hasOwnProperty.call(item, key) &&
          item[key] !== null &&
          typeof item[key] !== 'object'
        ) {
          xml += `    <${key}>${String(item[key]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')}</${key}>\n`;
        }
      }
      xml += '  </item>\n';
    });
    xml += '</report>';
    return xml;
  };

  const handleExportXML = () => {
    if (data.length === 0) return;
    const xmlData = jsonToXml(data);
    const blob = new Blob([xmlData], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/ /g, '_')}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 items-end gap-4 md:grid-cols-4">
          {filterControls}
          <Button onClick={onGenerate} className="w-full md:w-auto">
            Gerar
          </Button>
        </div>
        {children}
        {data.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 flex justify-end gap-2">
              <Button onClick={handleExportPDF} className="bg-red-600 text-white hover:bg-red-700">
                <FileDown size={18} /> PDF
              </Button>
              <Button
                onClick={handleExportXML}
                className="bg-gray-700 text-white hover:bg-gray-800"
              >
                <FileDown size={18} /> XML
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                  <tr>
                    {columns.map((c) => (
                      <th key={c.dataKey} className="px-6 py-3">
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-b bg-white hover:bg-gray-50">
                      {columns.map((c) => (
                        <td key={c.dataKey} className="px-6 py-4">
                          {String(row[c.dataKey] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MovementReports = ({ movements, products }) => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGenerate = () => {
    const filtered = movements
      .filter((m) => {
        const moveDate = new Date(m.date);
        return moveDate >= new Date(startDate) && moveDate <= new Date(endDate);
      })
      .map((m) => ({
        ...m,
        productName: products.find((p) => p.id === m.productId)?.name || 'N/A',
      }));
    setData(filtered);
  };

  return (
    <ReportDisplay
      title="Movimentações de Estoque"
      columns={[
        { header: 'Data', dataKey: 'date' },
        { header: 'Produto', dataKey: 'productName' },
        { header: 'Tipo', dataKey: 'type' },
        { header: 'Quantidade', dataKey: 'quantity' },
        { header: 'Responsável', dataKey: 'responsible' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
        </>
      }
    />
  );
};

const StockPositionReports = ({ products }) => {
  const [data, setData] = useState([]);
  const handleGenerate = () => setData(products);
  return (
    <ReportDisplay
      title="Posição do Estoque"
      columns={[
        { header: 'Produto', dataKey: 'name' },
        { header: 'Cód. Interno', dataKey: 'internalCode' },
        { header: 'Estoque Atual', dataKey: 'currentStock' },
        { header: 'Custo Médio', dataKey: 'avgCost' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={<div />}
    />
  );
};

const PurchaseReports = ({ purchaseOrders, suppliers, products }) => {
  const [data, setData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  const handleGenerate = () => {
    const filtered = purchaseOrders
      .filter((po) => !selectedSupplier || po.supplierId === parseInt(selectedSupplier))
      .map((po) => ({
        ...po,
        supplierName: suppliers.find((s) => s.id === po.supplierId)?.name || 'N/A',
        itemsSummary: po.items
          .map(
            (item) =>
              `${item.quantity}x ${products.find((p) => p.id === item.productId)?.name || ''}`
          )
          .join(', '),
      }));
    setData(filtered);
  };

  return (
    <ReportDisplay
      title="Compras por Fornecedor"
      columns={[
        { header: 'Data', dataKey: 'date' },
        { header: 'Fornecedor', dataKey: 'supplierName' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Itens', dataKey: 'itemsSummary' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <div>
          <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          >
            <option value="">Todos</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
};

const CostCenterConsumptionReports = ({ movements, products, costCenters }) => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGenerate = () => {
    const consumptionByCC = {};
    costCenters.forEach((cc) => {
      consumptionByCC[cc.id] = { name: cc.name, totalValue: 0, totalItems: 0 };
    });

    movements
      .filter((m) => {
        const moveDate = new Date(m.date);
        return (
          m.type === 'saida' && moveDate >= new Date(startDate) && moveDate <= new Date(endDate)
        );
      })
      .forEach((m) => {
        const product = products.find((p) => p.id === m.productId);
        if (product && m.costCenterId && consumptionByCC[m.costCenterId]) {
          const cost = m.quantity * product.avgCost;
          consumptionByCC[m.costCenterId].totalValue += cost;
          consumptionByCC[m.costCenterId].totalItems += m.quantity;
        }
      });

    setData(
      Object.values(consumptionByCC)
        .filter((cc) => cc.totalValue > 0)
        .map((cc) => ({ ...cc, totalValue: cc.totalValue.toFixed(2) }))
    );
  };

  return (
    <ReportDisplay
      title="Consumo por Centro de Custo"
      columns={[
        { header: 'Centro de Custo', dataKey: 'name' },
        { header: 'Valor Consumido (R$)', dataKey: 'totalValue' },
        { header: 'Qtd. Itens', dataKey: 'totalItems' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
        </>
      }
    />
  );
};

const BatchExpiryReports = ({ products }) => {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(30);

  const handleGenerate = () => {
    const today = new Date();
    const futureDate = new Date(new Date().setDate(today.getDate() + parseInt(days)));
    const filtered = products
      .filter(
        (p) =>
          p.expiryDate && new Date(p.expiryDate) >= today && new Date(p.expiryDate) <= futureDate
      )
      .map((p) => ({
        ...p,
        daysToExpire: Math.round((new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.daysToExpire - b.daysToExpire);
    setData(filtered);
  };

  return (
    <ReportDisplay
      title="Vencimento de Lotes"
      columns={[
        { header: 'Produto', dataKey: 'name' },
        { header: 'Lote', dataKey: 'lot' },
        { header: 'Data de Vencimento', dataKey: 'expiryDate' },
        { header: 'Dias para Vencer', dataKey: 'daysToExpire' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vencimento nos próximos (dias)
          </label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
      }
    />
  );
};

const StockABCClassificationReports = ({ products, movements }) => {
  const [data, setData] = useState([]);

  const handleGenerate = () => {
    const consumption = {};
    movements
      .filter((m) => m.type === 'saida')
      .forEach((m) => {
        const product = products.find((p) => p.id === m.productId);
        if (product) {
          if (!consumption[m.productId]) {
            consumption[m.productId] = { id: m.productId, name: product.name, totalConsumption: 0 };
          }
          consumption[m.productId].totalConsumption += m.quantity * product.avgCost;
        }
      });

    const sortedProducts = Object.values(consumption).sort(
      (a, b) => b.totalConsumption - a.totalConsumption
    );
    const totalValue = sortedProducts.reduce((acc, p) => acc + p.totalConsumption, 0);

    let cumulativeValue = 0;
    const classifiedData = sortedProducts.map((p) => {
      cumulativeValue += p.totalConsumption;
      const cumulativePercentage = totalValue > 0 ? (cumulativeValue / totalValue) * 100 : 0;
      let classification = 'C';
      if (cumulativePercentage <= 80) {
        classification = 'A';
      } else if (cumulativePercentage <= 95) {
        classification = 'B';
      }
      return {
        ...p,
        classification,
        consumptionValue: p.totalConsumption.toFixed(2),
        cumulativePercentage: cumulativePercentage.toFixed(2) + '%',
      };
    });
    setData(classifiedData);
  };

  return (
    <ReportDisplay
      title="Classificação ABC de Estoque"
      columns={[
        { header: 'Produto', dataKey: 'name' },
        { header: 'Classificação', dataKey: 'classification' },
        { header: 'Valor Consumido (R$)', dataKey: 'consumptionValue' },
        { header: '% Acumulada', dataKey: 'cumulativePercentage' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <p className="col-span-2 text-sm">
          Este relatório analisa o valor total de consumo para classificar os itens. Não são
          necessários filtros adicionais.
        </p>
      }
    />
  );
};

const MaterialsWithoutMovementReports = ({ products, movements }) => {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(90);

  const handleGenerate = () => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);

    const movedProductIds = new Set(
      movements.filter((m) => new Date(m.date) >= thresholdDate).map((m) => m.productId)
    );

    const noMovementProducts = products.filter((p) => !movedProductIds.has(p.id));
    setData(noMovementProducts);
  };

  return (
    <ReportDisplay
      title={`Materiais sem Movimentação nos Últimos ${days} Dias`}
      columns={[
        { header: 'Produto', dataKey: 'name' },
        { header: 'Estoque Atual', dataKey: 'currentStock' },
        { header: 'Custo Médio', dataKey: 'avgCost' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <div>
          <label className="block text-sm font-medium text-gray-700">Sem movimento há (dias)</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </div>
      }
    />
  );
};

const SuppliersOfMaterialReport = ({ products, suppliers, purchaseOrders }) => {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleGenerate = () => {
    if (!selectedProduct) {
      setData([]);
      return;
    }
    const supplierIds = new Set(
      purchaseOrders
        .filter((po) => po.items.some((item) => item.productId === parseInt(selectedProduct)))
        .map((po) => po.supplierId)
    );
    const supplierData = suppliers.filter((s) => supplierIds.has(s.id));
    setData(supplierData);
  };

  return (
    <ReportDisplay
      title="Fornecedores por Material"
      columns={[
        { header: 'Fornecedor', dataKey: 'name' },
        { header: 'CNPJ', dataKey: 'cnpj' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Telefone', dataKey: 'phone' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <div>
          <label className="block text-sm font-medium text-gray-700">Selecione um Produto</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          >
            <option value="">-- Selecione --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
};

const PledgedMaterialsReport = ({ internalRequisitions, products }) => {
  const [data, setData] = useState([]);

  const handleGenerate = () => {
    const pledgedItems = {};
    internalRequisitions
      .filter((req) => req.status === 'Aprovado')
      .flatMap((req) => req.items)
      .forEach((item) => {
        if (pledgedItems[item.productId]) {
          pledgedItems[item.productId].quantity += item.quantity;
        } else {
          const product = products.find((p) => p.id === item.productId);
          pledgedItems[item.productId] = { name: product?.name || 'N/A', quantity: item.quantity };
        }
      });

    setData(Object.values(pledgedItems));
  };

  return (
    <ReportDisplay
      title="Materiais Empenhados (em Requisições Aprovadas)"
      columns={[
        { header: 'Produto', dataKey: 'name' },
        { header: 'Quantidade Empenhada', dataKey: 'quantity' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={<div />}
    />
  );
};

const AdjustmentReport = ({ movements, products }) => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGenerate = () => {
    const filtered = movements
      .filter((m) => {
        const moveDate = new Date(m.date);
        return (
          m.type === 'adjustment' &&
          moveDate >= new Date(startDate) &&
          moveDate <= new Date(endDate)
        );
      })
      .map((m) => ({
        ...m,
        productName: products.find((p) => p.id === m.productId)?.name || 'N/A',
        adjustmentType: m.quantity > 0 ? 'Complemento' : 'Estorno',
      }));
    setData(filtered);
  };

  return (
    <ReportDisplay
      title="Relação de Estorno/Complemento (Ajustes)"
      columns={[
        { header: 'Data', dataKey: 'date' },
        { header: 'Produto', dataKey: 'productName' },
        { header: 'Tipo', dataKey: 'adjustmentType' },
        { header: 'Quantidade', dataKey: 'quantity' },
        { header: 'Justificativa', dataKey: 'justification' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
        </>
      }
    />
  );
};

const AnnualEvolutionReport = ({ movements, products }) => {
  const [data, setData] = useState([]);

  const handleGenerate = () => {
    const monthlyConsumption = {};
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = `${monthNames[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      monthlyConsumption[monthKey] = 0;
    }

    movements.forEach((m) => {
      if (m.type === 'saida') {
        const moveDate = new Date(m.date);
        const monthKey = `${monthNames[moveDate.getMonth()]}/${String(moveDate.getFullYear()).slice(2)}`;
        if (monthlyConsumption.hasOwnProperty(monthKey)) {
          const product = products.find((p) => p.id === m.productId);
          if (product) {
            monthlyConsumption[monthKey] += m.quantity * product.avgCost;
          }
        }
      }
    });

    const chartData = Object.keys(monthlyConsumption)
      .map((key) => ({ month: key, Valor: parseFloat(monthlyConsumption[key].toFixed(2)) }))
      .reverse();

    setData(chartData);
  };

  return (
    <ReportDisplay
      title="Evolução Anual de Consumo"
      columns={[
        { header: 'Mês', dataKey: 'month' },
        { header: 'Valor Consumido (R$)', dataKey: 'Valor' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={<div />}
    >
      {data.length > 0 && (
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(val) => `R$${val.toLocaleString('pt-BR')}`} />
              <Tooltip
                formatter={(value) =>
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                }
              />
              <Legend />
              <Bar dataKey="Valor" fill="#8884d8" name="Valor Consumido" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportDisplay>
  );
};

const PriceEvolutionReport = ({ movements, products }) => {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleGenerate = () => {
    if (!selectedProduct) {
      setData([]);
      return;
    }
    const priceData = movements
      .filter((m) => m.type === 'entrada' && m.productId === parseInt(selectedProduct))
      .map((m) => ({ date: m.date, price: m.unitPrice }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setData(priceData);
  };

  return (
    <ReportDisplay
      title="Evolução de Preços por Produto"
      columns={[
        { header: 'Data da Compra', dataKey: 'date' },
        { header: 'Preço (R$)', dataKey: 'price' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <div>
          <label className="block text-sm font-medium text-gray-700">Selecione um Produto</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          >
            <option value="">-- Selecione --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {data.length > 0 && (
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="price" name="Preço de Compra" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportDisplay>
  );
};

const MovementChartReport = ({ movements, products }) => {
  const [data, setData] = useState([]);

  const handleGenerate = () => {
    const monthlyData = {};
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];

    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = `${monthNames[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      monthlyData[monthKey] = { entradas: 0, saidas: 0 };
    }

    movements.forEach((m) => {
      const moveDate = new Date(m.date);
      const monthKey = `${monthNames[moveDate.getMonth()]}/${String(moveDate.getFullYear()).slice(2)}`;
      if (monthlyData.hasOwnProperty(monthKey)) {
        const product = products.find((p) => p.id === m.productId);
        if (product) {
          const value =
            m.type === 'entrada' ? m.quantity * m.unitPrice : m.quantity * product.avgCost;
          if (m.type === 'entrada') {
            monthlyData[monthKey].entradas += value;
          } else if (m.type === 'saida') {
            monthlyData[monthKey].saidas += value;
          }
        }
      }
    });

    const chartData = Object.keys(monthlyData)
      .map((key) => ({
        month: key,
        Entradas: parseFloat(monthlyData[key].entradas.toFixed(2)),
        Saídas: parseFloat(monthlyData[key].saidas.toFixed(2)),
      }))
      .reverse();

    setData(chartData);
  };

  return (
    <ReportDisplay
      title="Gráfico de Movimentações (Entrada vs. Saída)"
      columns={[
        { header: 'Mês', dataKey: 'month' },
        { header: 'Entradas (R$)', dataKey: 'Entradas' },
        { header: 'Saídas (R$)', dataKey: 'Saídas' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={<div />}
    >
      {data.length > 0 && (
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                }
              />
              <Legend />
              <Bar dataKey="Entradas" fill="#82ca9d" />
              <Bar dataKey="Saídas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportDisplay>
  );
};

const ConsumptionReport = ({ movements, products }) => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGenerate = () => {
    const filtered = movements
      .filter((m) => {
        const moveDate = new Date(m.date);
        return (
          m.type === 'saida' && moveDate >= new Date(startDate) && moveDate <= new Date(endDate)
        );
      })
      .map((m) => {
        const product = products.find((p) => p.id === m.productId);
        return {
          ...m,
          productName: product?.name || 'N/A',
          totalCost: (m.quantity * (product?.avgCost || 0)).toFixed(2),
        };
      });
    setData(filtered);
  };

  return (
    <ReportDisplay
      title="Consumo de Materiais (Saídas)"
      columns={[
        { header: 'Data', dataKey: 'date' },
        { header: 'Produto', dataKey: 'productName' },
        { header: 'Quantidade', dataKey: 'quantity' },
        { header: 'Custo Total (R$)', dataKey: 'totalCost' },
        { header: 'Responsável', dataKey: 'responsible' },
      ]}
      data={data}
      onGenerate={handleGenerate}
      filterControls={
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            />
          </div>
        </>
      }
    />
  );
};

const PlaceholderReport = ({ title }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">Relatório em desenvolvimento...</p>
    </CardContent>
  </Card>
);

const ReportsPage = (props) => {
  const [selectedReport, setSelectedReport] = useState('movements');

  const reportComponents = {
    movements: <MovementReports {...props} />,
    'stock-position': <StockPositionReports {...props} />,
    'cost-center': <CostCenterConsumptionReports {...props} />,
    'no-movement': <MaterialsWithoutMovementReports {...props} />,
    purchases: <PurchaseReports {...props} />,
    suppliers: <SuppliersOfMaterialReport {...props} />,
    pledged: <PledgedMaterialsReport {...props} />,
    'stock-complement': <AdjustmentReport {...props} />,
    consumption: <ConsumptionReport {...props} />,
    'batch-expiry': <BatchExpiryReports {...props} />,
    'purchase-requests': (
      <InternalRequisitionsPage
        {...props}
        onSave={() => alert('Operação não disponível em modo de relatório')}
      />
    ),
    'purchase-orders': (
      <PurchaseOrdersPage
        {...props}
        onSave={() => alert('Operação não disponível em modo de relatório')}
      />
    ),
    'electronic-requisition': <PlaceholderReport title="Requisição Eletrônica/Material" />,
    'annual-evolution': <AnnualEvolutionReport {...props} />,
    'price-evolution': <PriceEvolutionReport {...props} />,
    'stock-classification': <StockABCClassificationReports {...props} />,
    'movement-chart': <MovementChartReport {...props} />,
    'consumption-during': <PlaceholderReport title="Consumo de Materiais Durante" />,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <BarChart3 className="h-5 w-5" /> Relatórios do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="report-select" className="text-sm font-medium text-gray-700">
            Selecione o relatório desejado
          </label>
          <select
            id="report-select"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none md:w-1/2"
          >
            <option value="movements">Movimentos (Geral)</option>
            <option value="consumption">Consumo de Materiais (Saídas)</option>
            <option value="stock-position">Posição do Estoque</option>
            <option value="cost-center">Consumo por Centro de Custo</option>
            <option value="batch-expiry">Vencimento de Lotes</option>
            <option value="stock-classification">Classificação ABC do Estoque</option>
            <option value="purchases">Compras por Fornecedor</option>
            <option value="no-movement">Materiais sem Movimentação</option>
            <option value="suppliers">Fornecedores do Material</option>
            <option value="pledged">Materiais Empenhados</option>
            <option value="stock-complement">Relação de Estorno/Complemento</option>
            <option value="purchase-requests">Requisições de Compra</option>
            <option value="annual-evolution">Gráfico: Evolução Anual de Consumo</option>
            <option value="price-evolution">Gráfico: Evolução de Preços</option>
            <option value="movement-chart">Gráfico: Entradas vs. Saídas</option>
          </select>
        </CardContent>
      </Card>

      {reportComponents[selectedReport]}
    </div>
  );
};

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [paymentRepositories, setPaymentRepositories] = useState([]);
  const [revenueSources, setRevenueSources] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [productItemTypes, setProductItemTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState({});
  const [movements, setMovements] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [invoicings, setInvoicings] = useState([]);
  const [cashMovements, setCashMovements] = useState([]);
  const [internalRequisitions, setInternalRequisitions] = useState([]);
  const [allocationRules, setAllocationRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const stateSetters = useMemo(
    () => ({
      products: setProducts,
      suppliers: setSuppliers,
      costCenters: setCostCenters,
      expenseCategories: setExpenseCategories,
      paymentRepositories: setPaymentRepositories,
      revenueSources: setRevenueSources,
      productUnits: setProductUnits,
      productItemTypes: setProductItemTypes,
      users: setUsers,
      groups: setGroups,
      groupPermissions: setGroupPermissions,
      movements: setMovements,
      purchaseOrders: setPurchaseOrders,
      expenses: setExpenses,
      revenues: setRevenues,
      invoicings: setInvoicings,
      cashMovements: setCashMovements,
      internalRequisitions: setInternalRequisitions,
      allocationRules: setAllocationRules,
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          Object.keys(stateSetters).map((key) =>
            fetch(`${API_URL}/${key.toLowerCase().replace(/_/g, '-')}`)
          )
        );
        for (const res of responses) {
          if (!res.ok) throw new Error(`Falha na conexão com a API: ${res.statusText}`);
        }
        const data = await Promise.all(responses.map((res) => res.json()));
        Object.values(stateSetters).forEach((setter, index) => setter(data[index]));
      } catch (err) {
        console.error('Erro ao buscar dados da API:', err);
        setError(
          `Não foi possível carregar os dados do sistema. Verifique se o servidor backend está rodando em ${API_URL}.`
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [API_URL, stateSetters]);

  const handleSave = useCallback(
    async (entity, data, setter) => {
      const isEditing = !!data.id;
      const url = isEditing ? `${API_URL}/${entity}/${data.id}` : `${API_URL}/${entity}`;
      const method = isEditing ? 'PUT' : 'POST';
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('A requisição à API falhou');
        const savedItem = await response.json();

        setter((prev) =>
          isEditing
            ? prev.map((item) => (item.id === savedItem.id ? savedItem : item))
            : [...prev, savedItem]
        );
      } catch (err) {
        console.error(`Erro ao salvar ${entity}:`, err);
        alert(`Erro ao salvar ${entity}. Verifique o console e a conexão com o backend.`);
      }
    },
    [API_URL, stateSetters]
  );

  const handleDelete = useCallback(
    async (entity, id, setter) => {
      try {
        const response = await fetch(`${API_URL}/${entity}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('A requisição à API falhou');
        setter((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error(`Erro ao deletar ${entity}:`, err);
        alert(`Erro ao deletar ${entity}. Verifique o console e a conexão com o backend.`);
      }
    },
    [API_URL, stateSetters]
  );

  const handleSaveMovement = useCallback(
    async (movementData) => {
      try {
        const response = await fetch(`${API_URL}/stock-movements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movementData),
        });
        if (!response.ok) throw new Error('A requisição à API falhou');
        const { newMovement, updatedProduct } = await response.json();
        setMovements((prev) => [newMovement, ...prev]);
        setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      } catch (err) {
        console.error(`Erro ao salvar movimentação:`, err);
        alert(`Erro ao salvar movimentação. Verifique o console e a conexão com o backend.`);
      }
    },
    [API_URL]
  );

  const PAGES = useMemo(
    () => ({
      dashboard: (
        <Dashboard
          products={products}
          movements={movements}
          purchaseOrders={purchaseOrders}
          costCenters={costCenters}
        />
      ),
      products: (
        <ProductsPage
          products={products}
          productUnits={productUnits}
          productItemTypes={productItemTypes}
          onSave={(data) => handleSave('products', data, setProducts)}
          onDelete={(id) => handleDelete('products', id, setProducts)}
        />
      ),
      movements: (
        <StockMovementsPage
          movements={movements}
          products={products}
          costCenters={costCenters}
          onSave={handleSaveMovement}
        />
      ),
      'purchase-orders': (
        <PurchaseOrdersPage
          purchaseOrders={purchaseOrders}
          products={products}
          onSave={(data) => handleSave('purchase-orders', data, setPurchaseOrders)}
        />
      ),
      suppliers: (
        <SuppliersPage
          suppliers={suppliers}
          onSave={(data) => handleSave('suppliers', data, setSuppliers)}
          onDelete={(id) => handleDelete('suppliers', id, setSuppliers)}
        />
      ),
      'internal-requisitions': (
        <InternalRequisitionsPage
          requisitions={internalRequisitions}
          products={products}
          costCenters={costCenters}
          onSave={(data) => handleSave('internal-requisitions', data, setInternalRequisitions)}
        />
      ),
      expenses: (
        <ExpensesPage
          expenses={expenses}
          suppliers={suppliers}
          expenseCategories={expenseCategories}
          costCenters={costCenters}
          paymentRepositories={paymentRepositories}
          onSave={(data) => handleSave('expenses', data, setExpenses)}
          onDelete={(id) => handleDelete('expenses', id, setExpenses)}
        />
      ),
      revenues: (
        <RevenuesPage
          revenues={revenues}
          repositories={paymentRepositories}
          sources={revenueSources}
          onSave={(data) => handleSave('revenues', data, setRevenues)}
          onDelete={(id) => handleDelete('revenues', id, setRevenues)}
        />
      ),
      invoicing: (
        <InvoicingPage
          invoicings={invoicings}
          costCenters={costCenters}
          onSave={(data) => handleSave('invoicings', data, setInvoicings)}
          onDelete={(id) => handleDelete('invoicings', id, setInvoicings)}
        />
      ),
      'cash-management': (
        <CashManagementPage
          movements={cashMovements}
          repositories={paymentRepositories}
          onSave={(data) => handleSave('cash-movements', data, setCashMovements)}
        />
      ),
      'cost-centers': (
        <CostCenterPage
          costCenters={costCenters}
          expenses={expenses}
          invoicings={invoicings}
          allocationRules={allocationRules}
          setAllocationRules={setAllocationRules}
          movements={movements}
          products={products}
        />
      ),
      reports: (
        <ReportsPage
          products={products}
          movements={movements}
          expenses={expenses}
          expenseCategories={expenseCategories}
          purchaseOrders={purchaseOrders}
          suppliers={suppliers}
          costCenters={costCenters}
          internalRequisitions={internalRequisitions}
        />
      ),
      settings: (
        <SettingsPage
          users={users}
          onSaveUser={(data) => handleSave('users', data, setUsers)}
          onDeleteUser={(id) => handleDelete('users', id, setUsers)}
          groups={groups}
          groupPermissions={groupPermissions}
          setGroupPermissions={setGroupPermissions}
          costCenters={costCenters}
          setCostCenters={setCostCenters}
          expenseCategories={expenseCategories}
          setExpenseCategories={setExpenseCategories}
          paymentRepositories={paymentRepositories}
          setPaymentRepositories={setPaymentRepositories}
          revenueSources={revenueSources}
          setRevenueSources={setRevenueSources}
          productUnits={productUnits}
          setProductUnits={setProductUnits}
          productItemTypes={productItemTypes}
          setProductItemTypes={setProductItemTypes}
          allocationRules={allocationRules}
          setAllocationRules={setAllocationRules}
        />
      ),
    }),
    [
      products,
      movements,
      purchaseOrders,
      costCenters,
      productUnits,
      productItemTypes,
      suppliers,
      internalRequisitions,
      expenses,
      paymentRepositories,
      revenueSources,
      revenues,
      invoicings,
      cashMovements,
      allocationRules,
      users,
      groups,
      groupPermissions,
      handleSave,
      handleDelete,
      handleSaveMovement,
      expenseCategories,
    ]
  );

  const NavItem = ({ page, icon, label, disabled = false }) => (
    <li
      onClick={() => !disabled && setCurrentPage(page)}
      className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${disabled ? 'cursor-not-allowed text-gray-400' : `cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'}`}`}
    >
      {icon}
      <span
        className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      >
        {label}
      </span>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div
          className={`flex h-16 items-center border-b p-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}
        >
          {isSidebarOpen && <span className="text-xl font-bold text-blue-700">ERP System</span>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-blue-600"
          >
            {isSidebarOpen ? (
              <ArrowLeft size={24} />
            ) : (
              <img
                src="https://placehold.co/40x40/3b82f6/FFFFFF?text=ERP"
                alt="Logo"
                className="rounded-full"
              />
            )}
          </button>
        </div>
        <nav className="flex h-[calc(100%-4rem)] flex-col p-4">
          <div className="flex-grow">
            <p
              className={`px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase ${isSidebarOpen ? '' : 'text-center'}`}
            >
              {isSidebarOpen ? 'Operacional' : 'OP'}
            </p>
            <ul className="space-y-2">
              <NavItem
                page="dashboard"
                icon={<Package size={24} />}
                label="Dashboard"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="products"
                icon={<ShoppingCart size={24} />}
                label="Produtos"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="internal-requisitions"
                icon={<ClipboardList size={24} />}
                label="Requisições"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="movements"
                icon={<FileText size={24} />}
                label="Movimentações"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="purchase-orders"
                icon={<CheckCircle size={24} />}
                label="Pedidos"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="suppliers"
                icon={<Users size={24} />}
                label="Fornecedores"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
            </ul>
            <p
              className={`px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase ${isSidebarOpen ? '' : 'text-center'}`}
            >
              {isSidebarOpen ? 'Financeiro' : 'FIN'}
            </p>
            <ul className="space-y-2">
              <NavItem
                page="expenses"
                icon={<DollarSign size={24} />}
                label="Despesas"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="revenues"
                icon={<TrendingUp size={24} />}
                label="Recebimentos"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="invoicing"
                icon={<Briefcase size={24} />}
                label="Faturamento"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="cash-management"
                icon={<Landmark size={24} />}
                label="Caixa"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
            </ul>
            <p
              className={`px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase ${isSidebarOpen ? '' : 'text-center'}`}
            >
              {isSidebarOpen ? 'Análise & Admin' : 'ADM'}
            </p>
            <ul className="space-y-2">
              <NavItem
                page="cost-centers"
                icon={<Briefcase size={24} />}
                label="Centro de Custos"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="reports"
                icon={<BarChart size={24} />}
                label="Relatórios"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
              <NavItem
                page="settings"
                icon={<Settings size={24} />}
                label="Configurações"
                {...{ currentPage, setCurrentPage, isSidebarOpen }}
              />
            </ul>
          </div>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {error && <ApiError message={error} />}
            {!error && PAGES[currentPage]}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
