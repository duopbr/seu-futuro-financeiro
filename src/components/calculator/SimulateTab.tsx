import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from './CurrencyInput';
import { PercentInput } from './PercentInput';
import { YearsInput } from './YearsInput';
import { ResultCard } from './ResultCard';
import { PatrimonyChart } from './PatrimonyChart';
import { simulatePatrimony, SimulationResult } from '@/lib/calculations';
import { Wallet, TrendingUp, Sparkles } from 'lucide-react';

export function SimulateTab() {
  const [patrimonioInicial, setPatrimonioInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaAnual, setTaxaAnual] = useState(10);
  const [prazoAnos, setPrazoAnos] = useState(10);
  
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const prazoMeses = prazoAnos * 12;
    const simulation = simulatePatrimony(
      patrimonioInicial,
      aporteMensal,
      taxaAnual,
      prazoMeses
    );
    setResult(simulation);
  }, [patrimonioInicial, aporteMensal, taxaAnual, prazoAnos]);

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
        <CardContent className="grid gap-4 sm:grid-cols-2">
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
            placeholder="10"
            max={50}
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
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Patrimônio Final"
              value={result.patrimonioFinal}
              icon={<Wallet className="h-5 w-5" />}
              variant="primary"
            />
            <ResultCard
              label="Total Investido"
              value={result.totalInvestido}
              icon={<TrendingUp className="h-5 w-5" />}
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
              <CardTitle className="text-lg">Evolução do Patrimônio</CardTitle>
              <CardDescription>
                Comparativo entre patrimônio total e valor investido ao longo do tempo
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
