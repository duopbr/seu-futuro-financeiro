import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { YearsInput } from './YearsInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { simulatePatrimony, SimulationResult, formatCurrency } from '@/lib/calculations';
import { Wallet, TrendingUp, Sparkles, TrendingDown, Gift, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SimulateTab() {
  const [patrimonioInicial, setPatrimonioInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaAnual, setTaxaAnual] = useState(10);
  const [inflacaoAnual, setInflacaoAnual] = useState(4.5);
  const [prazoAnos, setPrazoAnos] = useState(10);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const prazoMeses = prazoAnos * 12;
    const simulation = simulatePatrimony(
      patrimonioInicial,
      aporteMensal,
      taxaAnual,
      prazoMeses,
      inflacaoAnual
    );
    setResult(simulation);
  }, [patrimonioInicial, aporteMensal, taxaAnual, inflacaoAnual, prazoAnos]);

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

          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-4 w-4" />
              <span>Configurações Avançadas</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", advancedOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="p-4 bg-muted/50 rounded-lg max-w-xs">
                <PercentInput
                  id="inflacao-anual"
                  label="Inflação Esperada"
                  value={inflacaoAnual}
                  onChange={setInflacaoAnual}
                  placeholder="4,50"
                  max={50}
                  hint="Para calcular o valor real do patrimônio"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="Patrimônio Final"
              value={result.patrimonioFinal}
              icon={<Wallet className="h-5 w-5" />}
              variant="primary"
              subtitle="Valor nominal"
            />
            <ResultCard
              label="Patrimônio Real"
              value={result.patrimonioFinalReal}
              icon={<TrendingDown className="h-5 w-5" />}
              subtitle="Corrigido pela inflação"
            />
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
              subtitle={`Real: ${formatCurrency(result.jurosTotalReal)}`}
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução do Patrimônio</CardTitle>
              <CardDescription>
                Comparativo entre patrimônio total, valor real e valor investido ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatrimonyChart data={result.data} showReal={inflacaoAnual > 0} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
