import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PercentInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  id: string;
  hint?: string;
}

export function PercentInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "10",
  min = 0,
  max = 100,
  className,
  id,
  hint
}: PercentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
    const numericValue = parseFloat(rawValue) || 0;
    
    // Round to 2 decimal places
    const roundedValue = Math.round(numericValue * 100) / 100;
    
    if (min !== undefined && roundedValue < min) {
      onChange(min);
      return;
    }
    if (max !== undefined && roundedValue > max) {
      onChange(max);
      return;
    }
    
    onChange(roundedValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={value ? value.toString().replace('.', ',') : ''}
          onChange={handleChange}
          placeholder={placeholder}
          step="0.01"
          className="pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          % a.a.
        </span>
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
