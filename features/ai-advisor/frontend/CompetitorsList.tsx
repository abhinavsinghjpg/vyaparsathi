import { Building2 } from 'lucide-react';
import { Badge } from '@/components/Badge';

export function CompetitorsList({ competitors }: { competitors: string[] }) {
  return (
    <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
      <h4 className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
        <Building2 size={15} /> Major Established Competitors In Micro-Market
      </h4>
      <div className="flex flex-wrap gap-2">
        {competitors.map((brand, idx) => (
          <Badge key={idx} variant="outline" className="text-xs py-1 px-3 bg-muted/30">
            {brand}
          </Badge>
        ))}
      </div>
    </div>
  );
}

