import { useState } from 'react';
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
  // Initialize display value from prop
  const [displayValue, setDisplayValue] = useState(() => 
    value ? value.toString().replace('.', ',') : ''
  );
  
  // Track if input is focused to avoid external updates during editing
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^\d.,]/g, '');
    
    // Normalize: replace dot with comma
    inputValue = inputValue.replace('.', ',');
    
    // Limit to single comma
    const parts = inputValue.split(',');
    if (parts.length > 2) {
      inputValue = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    const [intPart, decPart] = inputValue.split(',');
    const finalDisplay = decPart !== undefined 
      ? `${intPart},${decPart.slice(0, 2)}` 
      : inputValue;
    
    setDisplayValue(finalDisplay);
    
    // Convert to number and validate
    const numericValue = parseFloat(finalDisplay.replace(',', '.')) || 0;
    
    if (numericValue >= min && numericValue <= max) {
      onChange(numericValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Sync display value with actual value on blur
    setDisplayValue(value ? value.toString().replace('.', ',') : '');
  };

  // Only update display from prop when not focused
  const displayValueToShow = isFocused 
    ? displayValue 
    : (value ? value.toString().replace('.', ',') : '');

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValueToShow}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
