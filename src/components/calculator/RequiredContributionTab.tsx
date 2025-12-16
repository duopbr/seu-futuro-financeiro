import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { YearsInput } from './YearsInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { InflationToggle } from './InflationToggle';
import { LeadCaptureDialog } from './LeadCaptureDialog';
import { HowToUseSection, TipBox, FieldList } from './HowToUseSection';
import { useCalculator } from '@/hooks/useCalculator';
import { RequiredContributionResult } from '@/lib/finance';
import { formatCurrency } from '@/lib/format';
import { PiggyBank, Wallet, Sparkles, AlertCircle, CheckCircle, TrendingDown, Calculator, Loader2 } from 'lucide-react';

export function RequiredContributionTab() {
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
  } = useCalculator('requiredContribution');

  const contribResult = result as RequiredContributionResult | null;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aporte necessário</CardTitle>
          <CardDescription>
            Defina a meta e o prazo. A calculadora estima qual aporte mensal seria necessário 
            para atingir o valor desejado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <HowToUseSection>
            <p>
              <strong className="text-foreground">O que esta calculadora faz?</strong><br />
              Descobre quanto você precisa investir por mês para atingir um objetivo financeiro no prazo desejado.
            </p>
            <div>
              <p className="mb-2"><strong className="text-foreground">Preencha os campos:</strong></p>
              <FieldList fields={[
                { name: 'Patrimônio Inicial', description: 'Quanto você já tem investido hoje' },
                { name: 'Rentabilidade Anual', description: 'Retorno esperado dos seus investimentos' },
                { name: 'Patrimônio Objetivo', description: 'O valor que você deseja atingir' },
                { name: 'Prazo', description: 'Em quantos anos você quer atingir o objetivo' },
              ]} />
            </div>
            <TipBox>
              Se o aporte calculado for muito alto para seu orçamento, considere aumentar o prazo 
              ou revisar o objetivo. Pequenos aumentos no prazo podem reduzir significativamente o aporte necessário.
            </TipBox>
          </HowToUseSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CurrencyInput
              id="patrimonio-inicial-contrib"
              label="Patrimônio Inicial"
              value={inputs.patrimonioInicial}
              onChange={(v) => updateInput('patrimonioInicial', v)}
              placeholder="10.000,00"
            />
            <PercentInput
              id="taxa-anual-contrib"
              label="Rentabilidade Anual"
              value={inputs.taxaAnual}
              onChange={(v) => updateInput('taxaAnual', v)}
              placeholder="10,00"
              max={100}
            />
            <CurrencyInput
              id="patrimonio-objetivo-contrib"
              label="Patrimônio Objetivo"
              value={inputs.patrimonioObjetivo}
              onChange={(v) => updateInput('patrimonioObjetivo', v)}
              placeholder="500.000,00"
              hint="Defina sua meta em reais (ex.: R$ 1.000.000)"
            />
            <YearsInput
              id="prazo-anos-contrib"
              label="Prazo"
              value={inputs.prazoAnos}
              onChange={(v) => updateInput('prazoAnos', v)}
              min={1}
              max={100}
              hint="Quanto maior o prazo, menor o aporte necessário"
            />
          </div>

          <InflationToggle
            id="considerar-inflacao-contrib"
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

      {/* Error Alert */}
      {showResults && contribResult && !contribResult.isPossible && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não foi possível calcular</AlertTitle>
          <AlertDescription>
            {contribResult.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert - when no contribution needed */}
      {showResults && contribResult && contribResult.isPossible && contribResult.aporteNecessario === 0 && contribResult.errorMessage && (
        <Alert className="border-green-500/30 bg-green-500/5">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Ótima notícia!</AlertTitle>
          <AlertDescription>
            {contribResult.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {showResults && contribResult && contribResult.isPossible && (
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
                    {formatCurrency(contribResult.aporteNecessario)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Para atingir {formatCurrency(inputs.patrimonioObjetivo)} em {inputs.prazoAnos} anos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inputs.considerarInflacao && (
              <ResultCard
                label="Patrimônio Real"
                value={contribResult.patrimonioFinalReal}
                icon={<TrendingDown className="h-5 w-5" />}
                subtitle="Corrigido pela inflação"
              />
            )}
            <ResultCard
              label="Total Investido"
              value={contribResult.totalInvestido}
              icon={<Wallet className="h-5 w-5" />}
              subtitle={`${inputs.prazoAnos * 12} aportes de ${formatCurrency(contribResult.aporteNecessario)}`}
            />
            <ResultCard
              label="Ganho com Juros"
              value={contribResult.jurosTotal}
              icon={<Sparkles className="h-5 w-5" />}
              variant="success"
              subtitle={inputs.considerarInflacao ? `Real: ${formatCurrency(contribResult.jurosTotalReal)}` : undefined}
            />
          </div>

          {/* Chart */}
          {contribResult.data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Projeção do Patrimônio</CardTitle>
                <CardDescription>
                  Evolução com aporte de {formatCurrency(contribResult.aporteNecessario)}/mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatrimonyChart data={contribResult.data} showReal={inputs.considerarInflacao} />
              </CardContent>
            </Card>
          )}
        </>
      )}

      <LeadCaptureDialog
        open={showLeadDialog}
        onOpenChange={setShowLeadDialog}
        onSubmit={handleLeadSubmit}
        calculatorType="AporteNecessario"
      />
    </div>
  );
}
