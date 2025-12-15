import { useState, useEffect } from 'react';
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
  const [displayValue, setDisplayValue] = useState(
    value ? value.toString().replace('.', ',') : ''
  );

  useEffect(() => {
    const currentNumeric = parseFloat(displayValue.replace(',', '.')) || 0;
    if (Math.abs(currentNumeric - value) > 0.001) {
      setDisplayValue(value ? value.toString().replace('.', ',') : '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^\d.,]/g, '');
    
    // Normalizar: substituir ponto por vírgula
    inputValue = inputValue.replace('.', ',');
    
    // Limitar a uma única vírgula
    const parts = inputValue.split(',');
    if (parts.length > 2) {
      inputValue = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limitar a 2 casas decimais
    const [intPart, decPart] = inputValue.split(',');
    const finalDisplay = decPart !== undefined 
      ? `${intPart},${decPart.slice(0, 2)}` 
      : inputValue;
    
    setDisplayValue(finalDisplay);
    
    // Converter para número e validar
    const numericValue = parseFloat(finalDisplay.replace(',', '.')) || 0;
    
    if (numericValue >= min && numericValue <= max) {
      onChange(numericValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
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
