import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { YearsInput } from './YearsInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { InflationToggle } from './InflationToggle';
import { LeadCaptureDialog } from './LeadCaptureDialog';
import { useCalculator } from '@/hooks/useCalculator';
import { SimulationResult } from '@/lib/finance';
import { formatCurrency } from '@/lib/format';
import { Wallet, TrendingUp, Sparkles, TrendingDown, Gift, Calculator, Loader2 } from 'lucide-react';

export function SimulateTab() {
  const {
    inputs,
    updateInput,
    result,
    showResults,
    showLeadDialog,
    setShowLeadDialog,
    handleCalculate,
    handleLeadSubmit,
    isCalculating,
    validation
  } = useCalculator('simulate');

  const simulationResult = result as SimulationResult | null;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parâmetros da Simulação</CardTitle>
          <CardDescription>
            Ajuste os valores para simular o crescimento do seu patrimônio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CurrencyInput
              id="patrimonio-inicial"
              label="Patrimônio Inicial"
              value={inputs.patrimonioInicial}
              onChange={(v) => updateInput('patrimonioInicial', v)}
              placeholder="10.000,00"
            />
            <CurrencyInput
              id="aporte-mensal"
              label="Aporte Mensal"
              value={inputs.aporteMensal}
              onChange={(v) => updateInput('aporteMensal', v)}
              placeholder="1.000,00"
            />
            <PercentInput
              id="taxa-anual"
              label="Rentabilidade Anual"
              value={inputs.taxaAnual}
              onChange={(v) => updateInput('taxaAnual', v)}
              placeholder="10,00"
              max={100}
              hint="Taxa nominal anual (será convertida para mensal)"
            />
            <YearsInput
              id="prazo-anos"
              label="Prazo"
              value={inputs.prazoAnos}
              onChange={(v) => updateInput('prazoAnos', v)}
              min={1}
              max={100}
            />
          </div>

          <InflationToggle
            id="considerar-inflacao"
            checked={inputs.considerarInflacao}
            onCheckedChange={(v) => updateInput('considerarInflacao', v)}
            inflationValue={inputs.inflacaoAnual}
            onInflationChange={(v) => updateInput('inflacaoAnual', v)}
          />

          <Button 
            onClick={handleCalculate} 
            className="w-full sm:w-auto" 
            size="lg"
            disabled={!validation.isValid || isCalculating}
          >
            {isCalculating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="h-4 w-4 mr-2" />
            )}
            {isCalculating ? 'Calculando...' : 'Calcular'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && simulationResult && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="Patrimônio Final"
              value={simulationResult.patrimonioFinal}
              icon={<Wallet className="h-5 w-5" />}
              variant="primary"
              subtitle="Valor nominal"
            />
            {inputs.considerarInflacao && (
              <ResultCard
                label="Patrimônio Real"
                value={simulationResult.patrimonioFinalReal}
                icon={<TrendingDown className="h-5 w-5" />}
                subtitle="Corrigido pela inflação"
              />
            )}
            <ResultCard
              label="Benefício dos Aportes"
              value={simulationResult.beneficioAportes}
              icon={<Gift className="h-5 w-5" />}
              variant="success"
              subtitle={`Sem aportes: ${formatCurrency(simulationResult.patrimonioFinalSemAportes)}`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Total Investido"
              value={simulationResult.totalInvestido}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <ResultCard
              label="Ganho com Juros"
              value={simulationResult.jurosTotal}
              icon={<Sparkles className="h-5 w-5" />}
              subtitle={inputs.considerarInflacao ? `Real: ${formatCurrency(simulationResult.jurosTotalReal)}` : undefined}
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução do Patrimônio</CardTitle>
              <CardDescription>
                Comparativo entre patrimônio total{inputs.considerarInflacao ? ', valor real' : ''} e valor investido ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatrimonyChart data={simulationResult.data} showReal={inputs.considerarInflacao} />
            </CardContent>
          </Card>
        </>
      )}

      <LeadCaptureDialog
        open={showLeadDialog}
        onOpenChange={setShowLeadDialog}
        onSubmit={handleLeadSubmit}
        calculatorType="SimularPatrimonio"
      />
    </div>
  );
}
