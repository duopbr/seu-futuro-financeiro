import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { calculateTimeToGoal, TimeToGoalResult, formatCurrency } from '@/lib/calculations';
import { Clock, Target, Calendar, AlertCircle, Wallet, Sparkles } from 'lucide-react';

export function TimeToGoalTab() {
  const [patrimonioInicial, setPatrimonioInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaAnual, setTaxaAnual] = useState(10);
  const [patrimonioObjetivo, setPatrimonioObjetivo] = useState(500000);
  
  const [result, setResult] = useState<TimeToGoalResult | null>(null);

  useEffect(() => {
    const calculation = calculateTimeToGoal(
      patrimonioInicial,
      aporteMensal,
      taxaAnual,
      patrimonioObjetivo
    );
    setResult(calculation);
  }, [patrimonioInicial, aporteMensal, taxaAnual, patrimonioObjetivo]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (years: number, months: number): string => {
    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    return parts.join(' e ') || '0 meses';
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Defina seu Objetivo</CardTitle>
          <CardDescription>
            Descubra em quanto tempo você atingirá seu patrimônio desejado
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <CurrencyInput
            id="patrimonio-inicial-goal"
            label="Patrimônio Inicial"
            value={patrimonioInicial}
            onChange={setPatrimonioInicial}
            placeholder="10.000,00"
          />
          <CurrencyInput
            id="aporte-mensal-goal"
            label="Aporte Mensal"
            value={aporteMensal}
            onChange={setAporteMensal}
            placeholder="1.000,00"
          />
          <PercentInput
            id="taxa-anual-goal"
            label="Rentabilidade Anual"
            value={taxaAnual}
            onChange={setTaxaAnual}
            placeholder="10"
            max={50}
          />
          <CurrencyInput
            id="patrimonio-objetivo"
            label="Patrimônio Objetivo"
            value={patrimonioObjetivo}
            onChange={setPatrimonioObjetivo}
            placeholder="500.000,00"
          />
        </CardContent>
      </Card>

      {/* Error Alert */}
      {result && !result.isPossible && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Objetivo não atingível</AlertTitle>
          <AlertDescription>
            {result.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && result.isPossible && (
        <>
          {/* Time Result - Highlighted */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo estimado</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">
                      {formatTime(result.years, result.remainingMonths)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-16 sm:pl-0">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data estimada</p>
                    <p className="font-medium">{formatDate(result.estimatedDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Patrimônio Final"
              value={result.patrimonioFinal}
              icon={<Target className="h-5 w-5" />}
              variant="primary"
              subtitle={`Meta: ${formatCurrency(patrimonioObjetivo)}`}
            />
            <ResultCard
              label="Total Investido"
              value={result.totalInvestido}
              icon={<Wallet className="h-5 w-5" />}
            />
            <ResultCard
              label="Ganho com Juros"
              value={result.jurosTotal}
              icon={<Sparkles className="h-5 w-5" />}
              variant="success"
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trajetória até o Objetivo</CardTitle>
              <CardDescription>
                Evolução do patrimônio até atingir {formatCurrency(patrimonioObjetivo)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatrimonyChart data={result.data} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
