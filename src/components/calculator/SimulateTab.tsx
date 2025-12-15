import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { YearsInput } from './YearsInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { LeadCaptureDialog } from './LeadCaptureDialog';
import { simulatePatrimony, SimulationResult, formatCurrency } from '@/lib/calculations';
import { useLeadCapture } from '@/hooks/use-lead-capture';
import { Wallet, TrendingUp, Sparkles, TrendingDown, Gift, Calculator } from 'lucide-react';

export function SimulateTab() {
  const [patrimonioInicial, setPatrimonioInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaAnual, setTaxaAnual] = useState(10);
  const [inflacaoAnual, setInflacaoAnual] = useState(4.5);
  const [prazoAnos, setPrazoAnos] = useState(10);
  const [considerarInflacao, setConsiderarInflacao] = useState(false);
  
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  
  const { isLeadCaptured } = useLeadCapture();

  const inflacaoEfetiva = considerarInflacao ? inflacaoAnual : 0;

  const performCalculation = () => {
    const prazoMeses = prazoAnos * 12;
    const simulation = simulatePatrimony(
      patrimonioInicial,
      aporteMensal,
      taxaAnual,
      prazoMeses,
      inflacaoEfetiva
    );
    setResult(simulation);
    setShowResults(true);
  };

  const handleCalculate = () => {
    if (isLeadCaptured()) {
      performCalculation();
    } else {
      setShowLeadDialog(true);
    }
  };

  const handleLeadSubmit = () => {
    performCalculation();
  };

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
              value={patrimonioInicial}
              onChange={setPatrimonioInicial}
              placeholder="10.000,00"
            />
            <CurrencyInput
              id="aporte-mensal"
              label="Aporte Mensal"
              value={aporteMensal}
              onChange={setAporteMensal}
              placeholder="1.000,00"
            />
            <PercentInput
              id="taxa-anual"
              label="Rentabilidade Anual"
              value={taxaAnual}
              onChange={setTaxaAnual}
              placeholder="10,00"
              max={100}
              hint="Taxa nominal anual (será convertida para mensal)"
            />
            <YearsInput
              id="prazo-anos"
              label="Prazo"
              value={prazoAnos}
              onChange={setPrazoAnos}
              min={1}
              max={50}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="considerar-inflacao" className="font-medium cursor-pointer">
                Considerar Inflação
              </Label>
              <span className="text-xs text-muted-foreground">
                Calcular valor real do patrimônio
              </span>
            </div>
            <Switch
              id="considerar-inflacao"
              checked={considerarInflacao}
              onCheckedChange={setConsiderarInflacao}
            />
          </div>

          {considerarInflacao && (
            <div className="p-3 bg-muted/30 rounded-lg max-w-xs">
              <PercentInput
                id="inflacao-anual"
                label="Inflação Esperada (% ao ano)"
                value={inflacaoAnual}
                onChange={setInflacaoAnual}
                placeholder="4,50"
                max={50}
              />
            </div>
          )}

          <Button onClick={handleCalculate} className="w-full sm:w-auto" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && result && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="Patrimônio Final"
              value={result.patrimonioFinal}
              icon={<Wallet className="h-5 w-5" />}
              variant="primary"
              subtitle="Valor nominal"
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
              label="Benefício dos Aportes"
              value={result.beneficioAportes}
              icon={<Gift className="h-5 w-5" />}
              variant="success"
              subtitle={`Sem aportes: ${formatCurrency(result.patrimonioFinalSemAportes)}`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <ResultCard
              label="Total Investido"
              value={result.totalInvestido}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <ResultCard
              label="Ganho com Juros"
              value={result.jurosTotal}
              icon={<Sparkles className="h-5 w-5" />}
              subtitle={considerarInflacao ? `Real: ${formatCurrency(result.jurosTotalReal)}` : undefined}
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução do Patrimônio</CardTitle>
              <CardDescription>
                Comparativo entre patrimônio total{considerarInflacao ? ', valor real' : ''} e valor investido ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatrimonyChart data={result.data} showReal={considerarInflacao} />
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
