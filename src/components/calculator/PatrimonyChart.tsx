import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationDataPoint } from '@/lib/finance';
import { formatCurrency, formatCompactCurrency } from '@/lib/format';

interface PatrimonyChartProps {
  data: SimulationDataPoint[];
  showReal?: boolean;
}

export function PatrimonyChart({ data, showReal = false }: PatrimonyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Preencha os campos para ver o gráfico</p>
      </div>
    );
  }

  // Determine if should show in years or months
  const maxMonth = data[data.length - 1]?.month || 0;
  const showYears = maxMonth > 24;
  
  // Group by year if more than 600 months (50 years) for performance
  const shouldGroupByYear = maxMonth > 600;

  // Prepare and filter chart data
  const chartData = useMemo(() => {
    if (shouldGroupByYear) {
      // Group by year: take one point per year
      const yearlyData = data.filter((point, index) => {
        if (index === 0) return true; // Always include first
        if (index === data.length - 1) return true; // Always include last
        return point.month % 12 === 0; // Include yearly points
      });
      
      return yearlyData.map(point => ({
        ...point,
        label: `${(point.month / 12).toFixed(0)} anos`,
        xValue: point.month / 12
      }));
    }
    
    // For shorter periods, filter to ~50 points max
    const step = Math.max(1, Math.floor(data.length / 50));
    const filteredData = data.filter((_, index) => 
      index === 0 || index === data.length - 1 || index % step === 0
    );
    
    return filteredData.map(point => ({
      ...point,
      label: showYears 
        ? `${(point.month / 12).toFixed(1)} anos`
        : `${point.month} meses`,
      xValue: showYears ? point.month / 12 : point.month
    }));
  }, [data, showYears, shouldGroupByYear]);

  const getLineName = (key: string) => {
    switch (key) {
      case 'patrimonio': return 'Patrimônio Nominal';
      case 'patrimonioReal': return 'Patrimônio Real';
      case 'patrimonioSemAportes': return 'Só o Inicial Rendendo';
      case 'investido': return 'Total Investido';
      default: return key;
    }
  };

  const formatTooltipLabel = (_: unknown, payload: { payload: { month: number } }[]) => {
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
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="xValue"
            tickFormatter={(value) => showYears || shouldGroupByYear ? `${value.toFixed(0)}a` : `${value}m`}
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
              getLineName(name)
            ]}
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Legend formatter={getLineName} />
          <Line 
            type="monotone" 
            dataKey="patrimonio" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
          {showReal && (
            <Line 
              type="monotone" 
              dataKey="patrimonioReal" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: 'hsl(var(--chart-2))' }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="patrimonioSemAportes" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: 'hsl(var(--chart-3))' }}
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
      {shouldGroupByYear && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Gráfico agrupado por ano para melhor visualização
        </p>
      )}
    </div>
  );
}
