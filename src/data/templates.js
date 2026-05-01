import { computeRadialLayout } from '../utils/layoutUtils.js';

const genId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const now = () => new Date().toISOString();

function buildTemplate(id, name, description, category, objective, topicsDef) {
  const centralId = `${id}-root`;
  const nodes = [
    { id: centralId, parentId: null, title: name, description, type: 'central', status: 'pendente', priority: 'alta', color: '#38BDF8', icon: 'Brain', step: 1, responsible: '', deadline: '', notes: '', createdAt: now(), updatedAt: now() },
  ];

  topicsDef.forEach((topic, ti) => {
    const topicId = `${id}-t${ti}`;
    nodes.push({ id: topicId, parentId: centralId, title: topic.title, description: topic.description || '', type: 'topic', status: 'pendente', priority: 'media', color: topic.color, icon: topic.icon || 'Circle', step: 3, responsible: '', deadline: '', notes: '', createdAt: now(), updatedAt: now() });
    (topic.children || []).forEach((sub, si) => {
      const subId = `${id}-t${ti}-s${si}`;
      nodes.push({ id: subId, parentId: topicId, title: sub, description: '', type: 'subtopic', status: 'pendente', priority: 'media', color: topic.color, icon: 'Dot', step: 4, responsible: '', deadline: '', notes: '', createdAt: now(), updatedAt: now() });
    });
  });

  const positions = computeRadialLayout(nodes);
  return {
    id, name, description, category, objective, currentStep: 1,
    nodes: nodes.map(n => ({ ...n, position: positions[n.id] || { x: 0, y: 0 } })),
    createdAt: now(), updatedAt: now(),
  };
}

export const TEMPLATES = [
  {
    key: 'projeto',
    label: 'Planejamento de Projeto',
    icon: 'FolderKanban',
    description: 'Estruture objetivos, etapas, responsáveis e riscos',
    build: () => buildTemplate(
      `tpl-projeto-${Date.now()}`,
      'Planejamento de Projeto',
      'Estrutura para planejamento completo de projeto',
      'projeto',
      'Organizar todas as fases, entregas e responsáveis do projeto de forma visual',
      [
        { title: 'Objetivo', color: '#6366F1', icon: 'Target', children: ['Meta principal', 'Indicadores de sucesso', 'Critérios de aceite'] },
        { title: 'Etapas', color: '#8B5CF6', icon: 'ListChecks', children: ['Planejamento', 'Execução', 'Monitoramento', 'Encerramento'] },
        { title: 'Responsáveis', color: '#10B981', icon: 'Users', children: ['Gerente de Projeto', 'Time de Desenvolvimento', 'Stakeholders'] },
        { title: 'Prazos', color: '#F59E0B', icon: 'Calendar', children: ['Data de início', 'Marcos intermediários', 'Entrega final'] },
        { title: 'Riscos', color: '#EF4444', icon: 'AlertTriangle', children: ['Riscos técnicos', 'Riscos de prazo', 'Riscos de orçamento'] },
        { title: 'Entregas', color: '#EC4899', icon: 'Package', children: ['Documentação', 'Produto / Software', 'Treinamento'] },
      ]
    ),
  },
  {
    key: 'estudo',
    label: 'Estudo',
    icon: 'GraduationCap',
    description: 'Organize conceitos, resumos e revisões',
    build: () => buildTemplate(
      `tpl-estudo-${Date.now()}`,
      'Estudo',
      'Organização de conteúdo para aprendizado',
      'estudo',
      'Estruturar todo o conteúdo de estudo de forma hierárquica e visual',
      [
        { title: 'Tema', color: '#6366F1', icon: 'BookOpen', children: ['Definição', 'Contexto', 'Importância'] },
        { title: 'Conceitos Principais', color: '#8B5CF6', icon: 'Lightbulb', children: ['Conceito 1', 'Conceito 2', 'Conceito 3'] },
        { title: 'Resumos', color: '#10B981', icon: 'FileText', children: ['Resumo capítulo 1', 'Resumo capítulo 2'] },
        { title: 'Exercícios', color: '#F59E0B', icon: 'PenTool', children: ['Exercícios práticos', 'Simulados', 'Correções'] },
        { title: 'Dúvidas', color: '#EF4444', icon: 'HelpCircle', children: ['Dúvida 1', 'Dúvida 2'] },
        { title: 'Revisões', color: '#38BDF8', icon: 'RotateCcw', children: ['Revisão 1ª semana', 'Revisão final'] },
      ]
    ),
  },
  {
    key: 'negocio',
    label: 'Modelo de Negócio',
    icon: 'Briefcase',
    description: 'Mapeie produto, público, marketing e financeiro',
    build: () => buildTemplate(
      `tpl-negocio-${Date.now()}`,
      'Modelo de Negócio',
      'Estrutura para análise e planejamento de negócio',
      'empresa',
      'Mapear todos os pilares do negócio de forma estratégica e visual',
      [
        { title: 'Proposta de Valor', color: '#6366F1', icon: 'Gem', children: ['Produto / Serviço', 'Diferencial', 'Problema resolvido'] },
        { title: 'Público-Alvo', color: '#8B5CF6', icon: 'Target', children: ['Persona principal', 'Segmento de mercado', 'Dores do cliente'] },
        { title: 'Marketing', color: '#10B981', icon: 'Megaphone', children: ['Canais de aquisição', 'Posicionamento', 'Conteúdo'] },
        { title: 'Vendas', color: '#F59E0B', icon: 'ShoppingCart', children: ['Funil de vendas', 'Ticket médio', 'Metas mensais'] },
        { title: 'Operação', color: '#EF4444', icon: 'Cog', children: ['Processos internos', 'Equipe', 'Fornecedores'] },
        { title: 'Financeiro', color: '#EC4899', icon: 'DollarSign', children: ['Receitas', 'Custos fixos', 'Custos variáveis', 'Lucro'] },
      ]
    ),
  },
  {
    key: 'problema',
    label: 'Análise de Problema',
    icon: 'SearchCode',
    description: 'Identifique causas, consequências e soluções',
    build: () => buildTemplate(
      `tpl-problema-${Date.now()}`,
      'Análise de Problema',
      'Estrutura para análise e resolução de problemas',
      'processo',
      'Identificar as causas raiz do problema e estruturar um plano de ação eficaz',
      [
        { title: 'Problema Central', color: '#EF4444', icon: 'AlertOctagon', children: ['Descrição detalhada', 'Impacto atual', 'Urgência'] },
        { title: 'Causas', color: '#F97316', icon: 'GitBranch', children: ['Causa principal', 'Causas secundárias', 'Fatores agravantes'] },
        { title: 'Consequências', color: '#EAB308', icon: 'Zap', children: ['Impacto imediato', 'Impacto de longo prazo'] },
        { title: 'Soluções', color: '#22C55E', icon: 'Lightbulb', children: ['Solução A', 'Solução B', 'Solução de emergência'] },
        { title: 'Plano de Ação', color: '#38BDF8', icon: 'CheckSquare', children: ['Ação imediata', 'Responsável', 'Prazo'] },
      ]
    ),
  },
  {
    key: 'metas',
    label: 'Metas Pessoais',
    icon: 'Star',
    description: 'Defina metas, hábitos e indicadores',
    build: () => buildTemplate(
      `tpl-metas-${Date.now()}`,
      'Metas Pessoais',
      'Planejamento de metas e objetivos pessoais',
      'pessoal',
      'Estruturar minhas metas de vida de forma clara, mensurável e com plano de ação definido',
      [
        { title: 'Meta Principal', color: '#6366F1', icon: 'Trophy', children: ['O que quero alcançar', 'Por que é importante', 'Prazo'] },
        { title: 'Motivações', color: '#EC4899', icon: 'Heart', children: ['Motivo 1', 'Motivo 2', 'Visão de futuro'] },
        { title: 'Ações', color: '#10B981', icon: 'Zap', children: ['Ação diária', 'Ação semanal', 'Ação mensal'] },
        { title: 'Hábitos', color: '#F59E0B', icon: 'Repeat', children: ['Hábito matinal', 'Hábito noturno', 'Eliminar hábito ruim'] },
        { title: 'Indicadores', color: '#38BDF8', icon: 'BarChart', children: ['Como medir progresso', 'Marco 1', 'Marco 2'] },
      ]
    ),
  },
];
