import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PercentInput } from './PercentInput';

interface InflationToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  inflationValue: number;
  onInflationChange: (value: number) => void;
}

export function InflationToggle({
  id,
  checked,
  onCheckedChange,
  inflationValue,
  onInflationChange
}: InflationToggleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={id} className="font-medium cursor-pointer">
            Considerar Inflação
          </Label>
          <span className="text-xs text-muted-foreground">
            Calcular valor real do patrimônio
          </span>
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>

      {checked && (
        <div className="p-3 bg-muted/30 rounded-lg max-w-xs">
          <PercentInput
            id={`${id}-value`}
            label="Inflação Esperada (% ao ano)"
            value={inflationValue}
            onChange={onInflationChange}
            placeholder="4,50"
            max={50}
          />
        </div>
      )}
    </div>
  );
}
