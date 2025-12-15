import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface YearsInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  id: string;
  showSlider?: boolean;
}

export function YearsInput({ 
  label, 
  value, 
  onChange, 
  min = 1,
  max = 50,
  className,
  id,
  showSlider = true
}: YearsInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(e.target.value, 10) || min;
    
    if (numericValue < min) {
      onChange(min);
      return;
    }
    if (numericValue > max) {
      onChange(max);
      return;
    }
    
    onChange(numericValue);
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {value * 12} meses
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0 w-24">
          <Input
            id={id}
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            className="pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            anos
          </span>
        </div>
        {showSlider && (
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={1}
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
}
