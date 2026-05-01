import { useMindMapStore } from '../../store/mindMapStore.js';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = [
  { n: 1, short: 'Tema' },
  { n: 2, short: 'Objetivo' },
  { n: 3, short: 'Categorias' },
  { n: 4, short: 'Detalhar' },
  { n: 5, short: 'Priorizar' },
  { n: 6, short: 'Status' },
  { n: 7, short: 'Revisão' },
];

export default function StepWizard() {
  const currentStep    = useMindMapStore(s => s.getCurrentMap()?.currentStep ?? 1);
  const setCurrentStep = useMindMapStore(s => s.setCurrentStep);

  return (
    <div
      className="glass"
      style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        borderRadius: 40, padding: '6px 16px', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 4,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        animation: 'fade-in 0.3s ease-out',
      }}
    >
      <button
        className="btn-icon"
        style={{ padding: 4, borderRadius: '50%' }}
        disabled={currentStep <= 1}
        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
      >
        <ChevronLeft size={14} color={currentStep <= 1 ? '#334155' : '#94A3B8'} />
      </button>

      {STEPS.map((step, i) => {
        const done   = step.n < currentStep;
        const active = step.n === currentStep;
        return (
          <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && (
              <div style={{ width: 20, height: 1.5, background: done ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
            )}
            <button
              onClick={() => setCurrentStep(step.n)}
              title={step.short}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: active ? '4px 10px' : '4px 8px',
                borderRadius: 20, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: done ? 'transparent' : active ? 'rgba(56,189,248,0.15)' : 'transparent',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700,
                background: done ? 'rgba(34,197,94,0.2)' : active ? '#38BDF8' : 'rgba(255,255,255,0.07)',
                color: done ? '#22C55E' : active ? '#0F172A' : '#475569',
                border: done ? '1.5px solid #22C55E44' : active ? 'none' : '1.5px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}>
                {done ? <Check size={10} /> : step.n}
              </div>
              {active && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#38BDF8', whiteSpace: 'nowrap' }}>
                  {step.short}
                </span>
              )}
            </button>
          </div>
        );
      })}

      <button
        className="btn-icon"
        style={{ padding: 4, borderRadius: '50%' }}
        disabled={currentStep >= 7}
        onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
      >
        <ChevronRight size={14} color={currentStep >= 7 ? '#334155' : '#94A3B8'} />
      </button>
    </div>
  );
}
