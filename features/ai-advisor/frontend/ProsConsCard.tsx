import { CheckCircle2, XCircle } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export function ProsConsCard({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pros */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
        <h4 className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
          <CheckCircle2 size={16} /> Key Strengths
        </h4>
        <ul className="space-y-2 text-xs text-foreground/85">
          {pros.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
        <h4 className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-red-400">
          <XCircle size={16} /> Risk Factors
        </h4>
        <ul className="space-y-2 text-xs text-foreground/85">
          {cons.map((c, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

