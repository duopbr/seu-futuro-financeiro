import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  id: string;
}

export function CurrencyInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "0,00",
  min = 0,
  max,
  className,
  id
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue, 10) / 100 || 0;
    
    if (min !== undefined && numericValue < min) {
      onChange(min);
      return;
    }
    if (max !== undefined && numericValue > max) {
      onChange(max);
      return;
    }
    
    onChange(numericValue);
  };

  const formatValue = (val: number): string => {
    if (val === 0) return '';
    return val.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          R$
        </span>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          value={formatValue(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    </div>
  );
}
