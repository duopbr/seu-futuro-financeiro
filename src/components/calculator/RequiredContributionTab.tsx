import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { YearsInput } from './YearsInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { calculateRequiredContribution, RequiredContributionResult, formatCurrency } from '@/lib/calculations';
import { PiggyBank, Wallet, Sparkles, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';

export function RequiredContributionTab() {
  const [patrimonioInicial, setPatrimonioInicial] = useState(10000);
  const [taxaAnual, setTaxaAnual] = useState(10);
  const [inflacaoAnual, setInflacaoAnual] = useState(4.5);
  const [patrimonioObjetivo, setPatrimonioObjetivo] = useState(500000);
  const [prazoAnos, setPrazoAnos] = useState(15);
  
  const [result, setResult] = useState<RequiredContributionResult | null>(null);

  useEffect(() => {
    const prazoMeses = prazoAnos * 12;
    const calculation = calculateRequiredContribution(
      patrimonioInicial,
      taxaAnual,
      patrimonioObjetivo,
      prazoMeses,
      inflacaoAnual
    );
    setResult(calculation);
  }, [patrimonioInicial, taxaAnual, inflacaoAnual, patrimonioObjetivo, prazoAnos]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calcule o Aporte Necessário</CardTitle>
          <CardDescription>
            Descubra quanto precisa investir por mês para atingir seu objetivo no prazo desejado
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CurrencyInput
            id="patrimonio-inicial-contrib"
            label="Patrimônio Inicial"
            value={patrimonioInicial}
            onChange={setPatrimonioInicial}
            placeholder="10.000,00"
          />
          <PercentInput
            id="taxa-anual-contrib"
            label="Rentabilidade Anual"
            value={taxaAnual}
            onChange={setTaxaAnual}
            placeholder="10,00"
            max={100}
          />
          <PercentInput
            id="inflacao-anual-contrib"
            label="Inflação Esperada"
            value={inflacaoAnual}
            onChange={setInflacaoAnual}
            placeholder="4,50"
            max={50}
            hint="Para calcular o valor real do patrimônio"
          />
          <CurrencyInput
            id="patrimonio-objetivo-contrib"
            label="Patrimônio Objetivo"
            value={patrimonioObjetivo}
            onChange={setPatrimonioObjetivo}
            placeholder="500.000,00"
          />
          <YearsInput
            id="prazo-anos-contrib"
            label="Prazo"
            value={prazoAnos}
            onChange={setPrazoAnos}
            min={1}
            max={50}
          />
        </CardContent>
      </Card>

      {/* Error Alert */}
      {result && !result.isPossible && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não foi possível calcular</AlertTitle>
          <AlertDescription>
            {result.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert - when no contribution needed */}
      {result && result.isPossible && result.aporteNecessario === 0 && result.errorMessage && (
        <Alert className="border-green-500/30 bg-green-500/5">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Ótima notícia!</AlertTitle>
          <AlertDescription>
            {result.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && result.isPossible && (
        <>
          {/* Required Contribution - Highlighted */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aporte Mensal Necessário</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatCurrency(result.aporteNecessario)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Para atingir {formatCurrency(patrimonioObjetivo)} em {prazoAnos} anos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="Patrimônio Real"
              value={result.patrimonioFinalReal}
              icon={<TrendingDown className="h-5 w-5" />}
              subtitle="Corrigido pela inflação"
            />
            <ResultCard
              label="Total Investido"
              value={result.totalInvestido}
              icon={<Wallet className="h-5 w-5" />}
              subtitle={`${prazoAnos * 12} aportes de ${formatCurrency(result.aporteNecessario)}`}
            />
            <ResultCard
              label="Ganho com Juros"
              value={result.jurosTotal}
              icon={<Sparkles className="h-5 w-5" />}
              variant="success"
              subtitle={`Real: ${formatCurrency(result.jurosTotalReal)}`}
            />
          </div>

          {/* Chart */}
          {result.data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Projeção do Patrimônio</CardTitle>
                <CardDescription>
                  Evolução com aporte de {formatCurrency(result.aporteNecessario)}/mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatrimonyChart data={result.data} showReal={inflacaoAnual > 0} />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
