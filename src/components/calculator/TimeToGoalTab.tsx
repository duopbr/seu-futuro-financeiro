import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { InflationToggle } from './InflationToggle';
import { LeadCaptureDialog } from './LeadCaptureDialog';
import { HowToUseSection, TipBox, FieldList } from './HowToUseSection';
import { useCalculator } from '@/hooks/useCalculator';
import { TimeToGoalResult } from '@/lib/finance';
import { formatCurrency, formatTimespan, formatDate } from '@/lib/format';
import { Clock, Target, Calendar, AlertCircle, Wallet, Sparkles, TrendingDown, Calculator, Loader2 } from 'lucide-react';

export function TimeToGoalTab() {
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
  } = useCalculator('timeToGoal');

  const timeResult = result as TimeToGoalResult | null;

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
          <HowToUseSection>
            <p>
              <strong className="text-foreground">O que esta calculadora faz?</strong><br />
              Calcula em quanto tempo você atingirá uma meta financeira específica com seus investimentos atuais.
            </p>
            <div>
              <p className="mb-2"><strong className="text-foreground">Preencha os campos:</strong></p>
              <FieldList fields={[
                { name: 'Patrimônio Inicial', description: 'Quanto você já tem investido hoje' },
                { name: 'Aporte Mensal', description: 'Valor que vai depositar todo mês' },
                { name: 'Rentabilidade Anual', description: 'Retorno esperado dos seus investimentos' },
                { name: 'Patrimônio Objetivo', description: 'O valor que você deseja atingir (ex: R$ 1.000.000)' },
              ]} />
            </div>
            <TipBox>
              Se aparecer "Objetivo não atingível", tente aumentar o aporte mensal ou a rentabilidade esperada. 
              Sem aportes e com rentabilidade zero, é impossível crescer o patrimônio.
            </TipBox>
          </HowToUseSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CurrencyInput
              id="patrimonio-inicial-goal"
              label="Patrimônio Inicial"
              value={inputs.patrimonioInicial}
              onChange={(v) => updateInput('patrimonioInicial', v)}
              placeholder="10.000,00"
            />
            <CurrencyInput
              id="aporte-mensal-goal"
              label="Aporte Mensal"
              value={inputs.aporteMensal}
              onChange={(v) => updateInput('aporteMensal', v)}
              placeholder="1.000,00"
            />
            <PercentInput
              id="taxa-anual-goal"
              label="Rentabilidade Anual"
              value={inputs.taxaAnual}
              onChange={(v) => updateInput('taxaAnual', v)}
              placeholder="10,00"
              max={100}
            />
            <CurrencyInput
              id="patrimonio-objetivo"
              label="Patrimônio Objetivo"
              value={inputs.patrimonioObjetivo}
              onChange={(v) => updateInput('patrimonioObjetivo', v)}
              placeholder="500.000,00"
            />
          </div>

          <InflationToggle
            id="considerar-inflacao-goal"
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
      {showResults && timeResult && !timeResult.isPossible && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Objetivo não atingível</AlertTitle>
          <AlertDescription>
            {timeResult.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {showResults && timeResult && timeResult.isPossible && (
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
                      {formatTimespan(timeResult.months)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-16 sm:pl-0">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data estimada</p>
                    <p className="font-medium">{formatDate(timeResult.estimatedDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Patrimônio Final"
              value={timeResult.patrimonioFinal}
              icon={<Target className="h-5 w-5" />}
              variant="primary"
              subtitle={`Meta: ${formatCurrency(inputs.patrimonioObjetivo)}`}
            />
            {inputs.considerarInflacao && (
              <ResultCard
                label="Patrimônio Real"
                value={timeResult.patrimonioFinalReal}
                icon={<TrendingDown className="h-5 w-5" />}
                subtitle="Corrigido pela inflação"
              />
            )}
            <ResultCard
              label="Total Investido"
              value={timeResult.totalInvestido}
              icon={<Wallet className="h-5 w-5" />}
            />
            <ResultCard
              label="Ganho com Juros"
              value={timeResult.jurosTotal}
              icon={<Sparkles className="h-5 w-5" />}
              variant="success"
              subtitle={inputs.considerarInflacao ? `Real: ${formatCurrency(timeResult.jurosTotalReal)}` : undefined}
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trajetória até o Objetivo</CardTitle>
              <CardDescription>
                Evolução do patrimônio até atingir {formatCurrency(inputs.patrimonioObjetivo)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatrimonyChart data={timeResult.data} showReal={inputs.considerarInflacao} />
            </CardContent>
          </Card>
        </>
      )}

      <LeadCaptureDialog
        open={showLeadDialog}
        onOpenChange={setShowLeadDialog}
        onSubmit={handleLeadSubmit}
        calculatorType="TempoParaObjetivo"
      />
    </div>
  );
}
