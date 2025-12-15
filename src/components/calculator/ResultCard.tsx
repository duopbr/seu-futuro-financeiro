import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success';
  subtitle?: string;
}

export function ResultCard({ label, value, icon, variant = 'default', subtitle }: ResultCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200",
      variant === 'primary' && "border-primary/30 bg-primary/5",
      variant === 'success' && "border-green-500/30 bg-green-500/5"
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn(
              "text-xl sm:text-2xl font-bold tracking-tight",
              variant === 'primary' && "text-primary",
              variant === 'success' && "text-green-600"
            )}>
              {formatCurrency(value)}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant === 'primary' && "bg-primary/10 text-primary",
              variant === 'success' && "bg-green-500/10 text-green-600",
              variant === 'default' && "bg-muted text-muted-foreground"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
