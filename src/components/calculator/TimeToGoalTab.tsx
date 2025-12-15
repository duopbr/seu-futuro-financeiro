import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { calculateTimeToGoal, TimeToGoalResult, formatCurrency } from '@/lib/calculations';
import { Clock, Target, Calendar, AlertCircle, Wallet, Sparkles, TrendingDown } from 'lucide-react';

export function TimeToGoalTab() {
  const [patrimonioInicial, setPatrimonioInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaAnual, setTaxaAnual] = useState(10);
  const [inflacaoAnual, setInflacaoAnual] = useState(4.5);
  const [patrimonioObjetivo, setPatrimonioObjetivo] = useState(500000);
  const [considerarInflacao, setConsiderarInflacao] = useState(false);
  
  const [result, setResult] = useState<TimeToGoalResult | null>(null);

  const inflacaoEfetiva = considerarInflacao ? inflacaoAnual : 0;

  useEffect(() => {
    const calculation = calculateTimeToGoal(
      patrimonioInicial,
      aporteMensal,
      taxaAnual,
      patrimonioObjetivo,
      inflacaoEfetiva
    );
    setResult(calculation);
  }, [patrimonioInicial, aporteMensal, taxaAnual, inflacaoEfetiva, patrimonioObjetivo]);

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
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              placeholder="10,00"
              max={100}
            />
            <CurrencyInput
              id="patrimonio-objetivo"
              label="Patrimônio Objetivo"
              value={patrimonioObjetivo}
              onChange={setPatrimonioObjetivo}
              placeholder="500.000,00"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="considerar-inflacao-goal" className="font-medium cursor-pointer">
                Considerar Inflação
              </Label>
              <span className="text-xs text-muted-foreground">
                Calcular valor real do patrimônio
              </span>
            </div>
            <Switch
              id="considerar-inflacao-goal"
              checked={considerarInflacao}
              onCheckedChange={setConsiderarInflacao}
            />
          </div>

          {considerarInflacao && (
            <div className="p-3 bg-muted/30 rounded-lg max-w-xs">
              <PercentInput
                id="inflacao-anual-goal"
                label="Inflação Esperada (% ao ano)"
                value={inflacaoAnual}
                onChange={setInflacaoAnual}
                placeholder="4,50"
                max={50}
              />
            </div>
          )}
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Patrimônio Final"
              value={result.patrimonioFinal}
              icon={<Target className="h-5 w-5" />}
              variant="primary"
              subtitle={`Meta: ${formatCurrency(patrimonioObjetivo)}`}
            />
            {considerarInflacao && (
              <ResultCard
                label="Patrimônio Real"
                value={result.patrimonioFinalReal}
                icon={<TrendingDown className="h-5 w-5" />}
                subtitle="Corrigido pela inflação"
              />
            )}
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
              subtitle={considerarInflacao ? `Real: ${formatCurrency(result.jurosTotalReal)}` : undefined}
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
              <PatrimonyChart data={result.data} showReal={considerarInflacao} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
