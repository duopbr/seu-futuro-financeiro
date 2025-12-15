import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationDataPoint, formatCurrency, formatCompactCurrency } from '@/lib/calculations';

interface PatrimonyChartProps {
  data: SimulationDataPoint[];
}

export function PatrimonyChart({ data }: PatrimonyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Preencha os campos para ver o gráfico</p>
      </div>
    );
  }

  // Determinar se deve mostrar em anos ou meses
  const maxMonth = data[data.length - 1]?.month || 0;
  const showYears = maxMonth > 24;

  // Preparar dados para o gráfico
  const chartData = data.map(point => ({
    ...point,
    label: showYears 
      ? `${(point.month / 12).toFixed(1)} anos`
      : `${point.month} meses`,
    xValue: showYears ? point.month / 12 : point.month
  }));

  // Filtrar pontos para melhor visualização (max ~50 pontos)
  const step = Math.max(1, Math.floor(chartData.length / 50));
  const filteredData = chartData.filter((_, index) => 
    index === 0 || index === chartData.length - 1 || index % step === 0
  );

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="xValue"
            tickFormatter={(value) => showYears ? `${value.toFixed(0)}a` : `${value}m`}
            className="text-xs fill-muted-foreground"
          />
          <YAxis 
            tickFormatter={formatCompactCurrency}
            className="text-xs fill-muted-foreground"
            width={70}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'patrimonio' ? 'Patrimônio' : 'Total Investido'
            ]}
            labelFormatter={(_, payload) => {
              if (payload && payload[0]) {
                const month = payload[0].payload.month;
                const years = Math.floor(month / 12);
                const months = month % 12;
                if (years > 0) {
                  return months > 0 ? `${years} anos e ${months} meses` : `${years} anos`;
                }
                return `${month} meses`;
              }
              return '';
            }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            formatter={(value) => value === 'patrimonio' ? 'Patrimônio Total' : 'Total Investido'}
          />
          <Line 
            type="monotone" 
            dataKey="patrimonio" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
          <Line 
            type="monotone" 
            dataKey="investido" 
            stroke="hsl(var(--muted-foreground))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 5, fill: 'hsl(var(--muted-foreground))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
