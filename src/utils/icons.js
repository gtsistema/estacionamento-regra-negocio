import { createElement } from 'react';
import * as LucideIcons from 'lucide-react';

// Dynamic icon renderer — falls back to Circle for any unknown icon name
export function NodeIcon({ name, size = 16, color, className = '' }) {
  const Icon = LucideIcons[name] || LucideIcons.Circle;
  return createElement(Icon, { size, color, className });
}

export const STATUS_CONFIG = {
  pendente:     { label: 'Pendente',      color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
  em_andamento: { label: 'Em Andamento',  color: '#EAB308', bg: 'rgba(234,179,8,0.12)'  },
  concluido:    { label: 'Concluído',     color: '#22C55E', bg: 'rgba(34,197,94,0.12)'   },
  bloqueado:    { label: 'Bloqueado',     color: '#EF4444', bg: 'rgba(239,68,68,0.12)'   },
};

export const PRIORITY_CONFIG = {
  alta:  { label: 'Alta',  color: '#EF4444' },
  media: { label: 'Média', color: '#F97316' },
  baixa: { label: 'Baixa', color: '#38BDF8' },
};

export const TYPE_LABELS = {
  central: 'Tema Central', topic: 'Tópico',
  subtopic: 'Subtópico', task: 'Tarefa', note: 'Nota',
};

export const PRESET_COLORS = [
  '#38BDF8','#6366F1','#8B5CF6','#EC4899',
  '#10B981','#F59E0B','#EF4444','#F97316',
  '#34D399','#818CF8','#FB923C','#F472B6',
];
