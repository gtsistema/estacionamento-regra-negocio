import { computeRadialLayout } from '../utils/layoutUtils.js';

const now = new Date().toISOString();

const rawNodes = [
  // ─── CENTRAL ───────────────────────────────────────────────
  { id: 'n-root', parentId: null, title: 'GTSystem', description: 'Sistema de Gestão de Estacionamento com Transportadoras', type: 'central', status: 'em_andamento', priority: 'alta', color: '#38BDF8', icon: 'Building2', step: 1, responsible: 'Alex / Jorge', deadline: '', notes: 'Sistema em desenvolvimento ativo', createdAt: now, updatedAt: now },

  // ─── TÓPICOS PRINCIPAIS ─────────────────────────────────────
  { id: 'n-t1', parentId: 'n-root', title: 'Perfis de Acesso', description: 'Tipos de usuários e seus acessos ao sistema', type: 'topic', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'Users', step: 3, responsible: 'Jorge', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2', parentId: 'n-root', title: 'Módulos do Sistema', description: 'Telas e funcionalidades principais', type: 'topic', status: 'em_andamento', priority: 'alta', color: '#8B5CF6', icon: 'Layout', step: 3, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t3', parentId: 'n-root', title: 'Modalidades de Cobrança', description: 'Formas de cálculo do valor do estacionamento', type: 'topic', status: 'concluido', priority: 'alta', color: '#10B981', icon: 'DollarSign', step: 3, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4', parentId: 'n-root', title: 'Dados do Veículo', description: 'Informações sobre veículos e condutores', type: 'topic', status: 'em_andamento', priority: 'alta', color: '#F59E0B', icon: 'Car', step: 3, responsible: 'Jorge', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5', parentId: 'n-root', title: 'Comprovante de Movimento', description: 'Documento emitido a cada entrada/saída', type: 'topic', status: 'pendente', priority: 'media', color: '#EC4899', icon: 'FileText', step: 3, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },

  // ─── T1: PERFIS DE ACESSO ───────────────────────────────────
  { id: 'n-t1-s1', parentId: 'n-t1', title: 'Administrador', description: 'Acesso total ao sistema', type: 'subtopic', status: 'concluido', priority: 'alta', color: '#6366F1', icon: 'ShieldCheck', step: 4, responsible: 'Alex / Jorge', deadline: '', notes: 'Usuários: alex (admin), jorge (usuário)', createdAt: now, updatedAt: now },
  { id: 'n-t1-s2', parentId: 'n-t1', title: 'Estacionamento', description: 'Gestão do pátio e movimentos', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'ParkingSquare', step: 4, responsible: 'Jorge', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s3', parentId: 'n-t1', title: 'Transportadora', description: 'Empresa dona dos veículos', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'Truck', step: 4, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },

  { id: 'n-t1-s1-1', parentId: 'n-t1-s1', title: 'Acesso Geral ao Sistema', description: 'Cadastros, configurações, relatórios e financeiro', type: 'task', status: 'concluido', priority: 'alta', color: '#6366F1', icon: 'Key', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s2-1', parentId: 'n-t1-s2', title: 'Cadastro Completo', description: 'CNPJ, Razão Social, CPF, Email, Contato, Endereço', type: 'task', status: 'concluido', priority: 'alta', color: '#6366F1', icon: 'ClipboardList', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s2-2', parentId: 'n-t1-s2', title: 'Capacidade de Vagas', description: 'Limitador de vagas do pátio', type: 'task', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'Hash', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s2-3', parentId: 'n-t1-s2', title: 'Taxa / Mensalidade', description: 'Configuração dos valores cobrados', type: 'task', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'Receipt', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s2-4', parentId: 'n-t1-s2', title: 'Infraestrutura', description: 'Segurança: Sim/Não | Banheiro: Sim/Não | Tamanho', type: 'task', status: 'pendente', priority: 'baixa', color: '#6366F1', icon: 'Settings', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s3-1', parentId: 'n-t1-s3', title: 'Criado pelo Administrador', description: 'Acesso criado e gerenciado pelo admin', type: 'task', status: 'concluido', priority: 'alta', color: '#6366F1', icon: 'UserPlus', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s3-2', parentId: 'n-t1-s3', title: 'Importação por Excel', description: 'Upload de clientes, placas e condutores', type: 'task', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'FileSpreadsheet', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t1-s3-3', parentId: 'n-t1-s3', title: 'Dados Obrigatórios', description: 'CNPJ Transportadora, Placas, Condutores (Nome + CPF)', type: 'task', status: 'em_andamento', priority: 'alta', color: '#6366F1', icon: 'AlertCircle', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },

  // ─── T2: MÓDULOS DO SISTEMA ─────────────────────────────────
  { id: 'n-t2-s1', parentId: 'n-t2', title: '01 · Login', description: 'Tela de autenticação', type: 'subtopic', status: 'concluido', priority: 'alta', color: '#8B5CF6', icon: 'LogIn', step: 4, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s2', parentId: 'n-t2', title: '03 · Dashboard', description: 'Visão geral em tempo real', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#8B5CF6', icon: 'LayoutDashboard', step: 4, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s3', parentId: 'n-t2', title: '04 · Movimentos', description: 'Entrada e saída de veículos', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#8B5CF6', icon: 'ArrowLeftRight', step: 4, responsible: 'Jorge', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s4', parentId: 'n-t2', title: '05 · Relatórios', description: 'Histórico e filtros de movimentação', type: 'subtopic', status: 'pendente', priority: 'media', color: '#8B5CF6', icon: 'BarChart2', step: 4, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s5', parentId: 'n-t2', title: '06 · Financeiro', description: 'Faturamento e faturas mensais', type: 'subtopic', status: 'pendente', priority: 'alta', color: '#8B5CF6', icon: 'Wallet', step: 4, responsible: 'Jorge', deadline: '', notes: '', createdAt: now, updatedAt: now },

  { id: 'n-t2-s1-1', parentId: 'n-t2-s1', title: 'E-mail ou CPF/CNPJ', description: 'Campo de usuário obrigatório', type: 'task', status: 'concluido', priority: 'alta', color: '#8B5CF6', icon: 'Mail', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s1-2', parentId: 'n-t2-s1', title: 'Senha (mín. 6 caracteres)', description: 'Validação de senha obrigatória', type: 'task', status: 'concluido', priority: 'alta', color: '#8B5CF6', icon: 'Lock', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s1-3', parentId: 'n-t2-s1', title: 'Recuperação de Senha', description: 'WhatsApp / SMS — implementação futura', type: 'task', status: 'pendente', priority: 'baixa', color: '#8B5CF6', icon: 'MessageSquare', step: 4, responsible: '', deadline: '', notes: 'Funcionalidade futura', createdAt: now, updatedAt: now },
  { id: 'n-t2-s2-1', parentId: 'n-t2-s2', title: 'Veículos Estacionados', description: 'Filtro por dia atual ou data', type: 'task', status: 'em_andamento', priority: 'alta', color: '#8B5CF6', icon: 'Car', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s2-2', parentId: 'n-t2-s2', title: 'Faturamento do Dia', description: 'Receita gerada no período', type: 'task', status: 'em_andamento', priority: 'alta', color: '#8B5CF6', icon: 'TrendingUp', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s2-3', parentId: 'n-t2-s2', title: 'Agendamentos', description: 'Placa + Transportadora agendados', type: 'task', status: 'pendente', priority: 'media', color: '#8B5CF6', icon: 'Calendar', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s3-1', parentId: 'n-t2-s3', title: 'Entrada de Veículos', description: 'Busca por placa + dados do condutor', type: 'task', status: 'em_andamento', priority: 'alta', color: '#8B5CF6', icon: 'LogIn', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s3-2', parentId: 'n-t2-s3', title: 'Saída (Temporária / Permanente)', description: 'Registro de saída com comprovante', type: 'task', status: 'pendente', priority: 'alta', color: '#8B5CF6', icon: 'LogOut', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s4-1', parentId: 'n-t2-s4', title: 'Busca por Transportadora / Condutor / Placa', description: 'Campos de busca nos relatórios', type: 'task', status: 'pendente', priority: 'media', color: '#8B5CF6', icon: 'Search', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s4-2', parentId: 'n-t2-s4', title: 'Filtros de Data e Faturamento', description: 'Data, Faturado/Não Faturado', type: 'task', status: 'pendente', priority: 'media', color: '#8B5CF6', icon: 'Filter', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s5-1', parentId: 'n-t2-s5', title: 'Geração de Fatura Mensal', description: 'Fatura por transportadora com período configurável', type: 'task', status: 'pendente', priority: 'alta', color: '#8B5CF6', icon: 'FileCheck', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s5-2', parentId: 'n-t2-s5', title: 'Exportação Excel', description: 'Exportar faturas e histórico', type: 'task', status: 'pendente', priority: 'media', color: '#8B5CF6', icon: 'Download', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t2-s5-3', parentId: 'n-t2-s5', title: 'Dados Bancários do Estacionamento', description: 'Habilitável na configuração', type: 'task', status: 'pendente', priority: 'media', color: '#8B5CF6', icon: 'CreditCard', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },

  // ─── T3: MODALIDADES DE COBRANÇA ────────────────────────────
  { id: 'n-t3-s1', parentId: 'n-t3', title: 'Diária', description: 'Cobrança por dia de permanência', type: 'subtopic', status: 'concluido', priority: 'alta', color: '#10B981', icon: 'Sun', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t3-s2', parentId: 'n-t3', title: 'Por Hora', description: 'Cobrança calculada por hora', type: 'subtopic', status: 'concluido', priority: 'alta', color: '#10B981', icon: 'Clock', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t3-s3', parentId: 'n-t3', title: 'Mensalidade / Fatura', description: 'Contrato mensal com fechamento periódico', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#10B981', icon: 'CalendarRange', step: 4, responsible: 'Alex', deadline: '', notes: '', createdAt: now, updatedAt: now },

  { id: 'n-t3-s3-1', parentId: 'n-t3-s3', title: 'Configuração de Fechamento', description: 'Definir quantos dias para fechar a fatura', type: 'task', status: 'em_andamento', priority: 'alta', color: '#10B981', icon: 'Settings2', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t3-s3-2', parentId: 'n-t3-s3', title: 'Valor Negociado', description: 'Preço acordado por transportadora', type: 'task', status: 'em_andamento', priority: 'alta', color: '#10B981', icon: 'HandshakeIcon', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t3-s3-3', parentId: 'n-t3-s3', title: 'Envio Automático por E-mail', description: 'Fatura + NF-e enviados automaticamente', type: 'task', status: 'pendente', priority: 'media', color: '#10B981', icon: 'Send', step: 4, responsible: '', deadline: '', notes: 'Campo de anexo PDF (NF-e) obrigatório', createdAt: now, updatedAt: now },

  // ─── T4: DADOS DO VEÍCULO ────────────────────────────────────
  { id: 'n-t4-s1', parentId: 'n-t4', title: 'Identificação do Veículo', description: 'Dados cadastrais do veículo', type: 'subtopic', status: 'concluido', priority: 'alta', color: '#F59E0B', icon: 'IdCard', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s2', parentId: 'n-t4', title: 'Condutor', description: 'Dados do motorista responsável', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#F59E0B', icon: 'UserCircle', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s3', parentId: 'n-t4', title: 'Agendamentos', description: 'Entrada futura com data/hora predefinida', type: 'subtopic', status: 'pendente', priority: 'media', color: '#F59E0B', icon: 'CalendarClock', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },

  { id: 'n-t4-s1-1', parentId: 'n-t4-s1', title: 'Placa (obrigatório)', description: 'Busca automática no banco de dados', type: 'task', status: 'concluido', priority: 'alta', color: '#F59E0B', icon: 'ScanLine', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s1-2', parentId: 'n-t4-s1', title: 'Marca / Modelo (obrigatório)', description: 'Autopreenchimento após busca pela placa', type: 'task', status: 'concluido', priority: 'alta', color: '#F59E0B', icon: 'Tag', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s1-3', parentId: 'n-t4-s1', title: 'Cor e Ano (facultativo)', description: 'Campos opcionais de identificação', type: 'task', status: 'concluido', priority: 'baixa', color: '#F59E0B', icon: 'Palette', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s2-1', parentId: 'n-t4-s2', title: 'Nome Completo e CPF', description: 'Identificação obrigatória do condutor', type: 'task', status: 'concluido', priority: 'alta', color: '#F59E0B', icon: 'UserCheck', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s2-2', parentId: 'n-t4-s2', title: 'Número de Celular', description: 'Contato do condutor', type: 'task', status: 'em_andamento', priority: 'media', color: '#F59E0B', icon: 'Smartphone', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s3-1', parentId: 'n-t4-s3', title: 'Data/Hora Futura', description: 'Agendamento com data e hora de entrada', type: 'task', status: 'pendente', priority: 'media', color: '#F59E0B', icon: 'Clock4', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t4-s3-2', parentId: 'n-t4-s3', title: 'Placa + Transportadora', description: 'Associação do agendamento', type: 'task', status: 'pendente', priority: 'media', color: '#F59E0B', icon: 'Link', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },

  // ─── T5: COMPROVANTE ────────────────────────────────────────
  { id: 'n-t5-s1', parentId: 'n-t5', title: 'Dados do Documento', description: 'Informações que compõem o comprovante', type: 'subtopic', status: 'em_andamento', priority: 'alta', color: '#EC4899', icon: 'FileText', step: 4, responsible: 'Jorge', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5-s2', parentId: 'n-t5', title: 'Dados Bancários', description: 'PIX / conta para pagamento', type: 'subtopic', status: 'pendente', priority: 'media', color: '#EC4899', icon: 'Landmark', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },

  { id: 'n-t5-s1-1', parentId: 'n-t5-s1', title: 'CNPJ Estabelecimento + Cliente', description: 'Identificação fiscal dos dois lados', type: 'task', status: 'em_andamento', priority: 'alta', color: '#EC4899', icon: 'Building', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5-s1-2', parentId: 'n-t5-s1', title: 'Placa e Condutor', description: 'Dados do veículo no comprovante', type: 'task', status: 'em_andamento', priority: 'alta', color: '#EC4899', icon: 'Car', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5-s1-3', parentId: 'n-t5-s1', title: 'Data/Hora Entrada e Saída', description: 'Registro completo de permanência', type: 'task', status: 'em_andamento', priority: 'alta', color: '#EC4899', icon: 'Timer', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5-s1-4', parentId: 'n-t5-s1', title: 'Tempo de Permanência e Valor', description: 'Cálculo baseado na modalidade configurada', type: 'task', status: 'pendente', priority: 'alta', color: '#EC4899', icon: 'Calculator', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5-s2-1', parentId: 'n-t5-s2', title: 'Habilitável na Configuração', description: 'Dados bancários opcionais no comprovante', type: 'task', status: 'pendente', priority: 'media', color: '#EC4899', icon: 'ToggleRight', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
  { id: 'n-t5-s2-2', parentId: 'n-t5-s2', title: 'Envio por E-mail', description: 'Comprovante enviado automaticamente ao cliente', type: 'task', status: 'pendente', priority: 'media', color: '#EC4899', icon: 'Send', step: 4, responsible: '', deadline: '', notes: '', createdAt: now, updatedAt: now },
];

const positions = computeRadialLayout(rawNodes);
const nodes = rawNodes.map(n => ({ ...n, position: positions[n.id] || { x: 0, y: 0 } }));

export const gtsystemMap = {
  id: 'map-gtsystem',
  name: 'GTSystem — Regra de Negócio',
  description: 'Mapa completo das regras de negócio do sistema de gestão de estacionamento',
  category: 'empresa',
  objective: 'Mapear e organizar todas as regras de negócio, módulos e funcionalidades do GTSystem para guiar o desenvolvimento da plataforma de gestão de estacionamento e transportadoras.',
  currentStep: 7,
  nodes,
  createdAt: now,
  updatedAt: now,
};
