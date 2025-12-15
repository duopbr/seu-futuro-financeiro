// Calculadora de Patrimônio - Funções de Cálculo Financeiro
// Premissas: Aportes mensais no fim do mês, taxa anual convertida para mensal efetiva

export interface SimulationDataPoint {
  month: number;
  patrimonio: number;
  investido: number;
  juros: number;
}

export interface SimulationResult {
  patrimonioFinal: number;
  totalInvestido: number;
  jurosTotal: number;
  data: SimulationDataPoint[];
}

export interface TimeToGoalResult {
  months: number;
  years: number;
  remainingMonths: number;
  estimatedDate: Date;
  isPossible: boolean;
  errorMessage?: string;
  data: SimulationDataPoint[];
  patrimonioFinal: number;
  totalInvestido: number;
  jurosTotal: number;
}

export interface RequiredContributionResult {
  aporteNecessario: number;
  totalInvestido: number;
  jurosTotal: number;
  isPossible: boolean;
  errorMessage?: string;
  data: SimulationDataPoint[];
}

// Converte taxa anual para taxa mensal efetiva
// r = (1 + i_anual)^(1/12) - 1
export function annualToMonthlyRate(annualRatePercent: number): number {
  const annualRateDecimal = annualRatePercent / 100;
  return Math.pow(1 + annualRateDecimal, 1 / 12) - 1;
}

// Simula patrimônio mês a mês
export function simulatePatrimony(
  patrimonioInicial: number,
  aporteMensal: number,
  taxaAnualPercent: number,
  prazoMeses: number
): SimulationResult {
  const r = annualToMonthlyRate(taxaAnualPercent);
  const data: SimulationDataPoint[] = [];
  
  let saldo = patrimonioInicial;
  
  // Ponto inicial (mês 0)
  data.push({
    month: 0,
    patrimonio: patrimonioInicial,
    investido: patrimonioInicial,
    juros: 0
  });
  
  for (let m = 1; m <= prazoMeses; m++) {
    // Rendimento do mês + aporte no fim do mês
    saldo = saldo * (1 + r) + aporteMensal;
    const investido = patrimonioInicial + aporteMensal * m;
    const juros = saldo - investido;
    
    data.push({
      month: m,
      patrimonio: saldo,
      investido,
      juros
    });
  }
  
  const totalInvestido = patrimonioInicial + aporteMensal * prazoMeses;
  const patrimonioFinal = saldo;
  const jurosTotal = patrimonioFinal - totalInvestido;
  
  return {
    patrimonioFinal,
    totalInvestido,
    jurosTotal,
    data
  };
}

// Calcula tempo para atingir objetivo
export function calculateTimeToGoal(
  patrimonioInicial: number,
  aporteMensal: number,
  taxaAnualPercent: number,
  patrimonioObjetivo: number
): TimeToGoalResult {
  const r = annualToMonthlyRate(taxaAnualPercent);
  
  // Caso: já atingiu o objetivo
  if (patrimonioInicial >= patrimonioObjetivo) {
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      estimatedDate: new Date(),
      isPossible: true,
      data: [{
        month: 0,
        patrimonio: patrimonioInicial,
        investido: patrimonioInicial,
        juros: 0
      }],
      patrimonioFinal: patrimonioInicial,
      totalInvestido: patrimonioInicial,
      jurosTotal: 0
    };
  }
  
  // Caso: impossível (sem aportes, sem rentabilidade, PV < objetivo)
  if (aporteMensal <= 0 && r <= 0 && patrimonioInicial < patrimonioObjetivo) {
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      estimatedDate: new Date(),
      isPossible: false,
      errorMessage: 'Com esses parâmetros, não é possível atingir o objetivo. Adicione aportes mensais ou uma rentabilidade positiva.',
      data: [],
      patrimonioFinal: 0,
      totalInvestido: 0,
      jurosTotal: 0
    };
  }
  
  // Calcular n usando fórmula (quando r > 0)
  let n: number;
  
  if (r > 0) {
    // n = ln((FV * r + PMT) / (PV * r + PMT)) / ln(1 + r)
    const numerator = patrimonioObjetivo * r + aporteMensal;
    const denominator = patrimonioInicial * r + aporteMensal;
    
    if (denominator <= 0 || numerator / denominator <= 0) {
      // Usar simulação iterativa
      n = simulateUntilGoal(patrimonioInicial, aporteMensal, r, patrimonioObjetivo);
    } else {
      n = Math.log(numerator / denominator) / Math.log(1 + r);
    }
  } else if (aporteMensal > 0) {
    // Taxa = 0, apenas aportes
    n = (patrimonioObjetivo - patrimonioInicial) / aporteMensal;
  } else {
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      estimatedDate: new Date(),
      isPossible: false,
      errorMessage: 'Com esses parâmetros, não é possível atingir o objetivo.',
      data: [],
      patrimonioFinal: 0,
      totalInvestido: 0,
      jurosTotal: 0
    };
  }
  
  // Arredondar para cima (meses completos)
  const meses = Math.ceil(n);
  
  // Limite de segurança (100 anos = 1200 meses)
  if (meses > 1200 || !isFinite(meses) || isNaN(meses)) {
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      estimatedDate: new Date(),
      isPossible: false,
      errorMessage: 'O prazo estimado excede 100 anos. Considere aumentar aportes ou a rentabilidade.',
      data: [],
      patrimonioFinal: 0,
      totalInvestido: 0,
      jurosTotal: 0
    };
  }
  
  // Simular para obter dados do gráfico
  const simulation = simulatePatrimony(patrimonioInicial, aporteMensal, taxaAnualPercent, meses);
  
  const years = Math.floor(meses / 12);
  const remainingMonths = meses % 12;
  
  const estimatedDate = new Date();
  estimatedDate.setMonth(estimatedDate.getMonth() + meses);
  
  return {
    months: meses,
    years,
    remainingMonths,
    estimatedDate,
    isPossible: true,
    data: simulation.data,
    patrimonioFinal: simulation.patrimonioFinal,
    totalInvestido: simulation.totalInvestido,
    jurosTotal: simulation.jurosTotal
  };
}

// Simulação iterativa para casos especiais
function simulateUntilGoal(
  patrimonioInicial: number,
  aporteMensal: number,
  r: number,
  patrimonioObjetivo: number
): number {
  let saldo = patrimonioInicial;
  let m = 0;
  const maxMonths = 1200; // 100 anos
  
  while (saldo < patrimonioObjetivo && m < maxMonths) {
    saldo = saldo * (1 + r) + aporteMensal;
    m++;
  }
  
  return m;
}

// Calcula aporte necessário para atingir objetivo
export function calculateRequiredContribution(
  patrimonioInicial: number,
  taxaAnualPercent: number,
  patrimonioObjetivo: number,
  prazoMeses: number
): RequiredContributionResult {
  const r = annualToMonthlyRate(taxaAnualPercent);
  const n = prazoMeses;
  
  // Caso: já atingiu o objetivo
  if (patrimonioInicial >= patrimonioObjetivo) {
    return {
      aporteNecessario: 0,
      totalInvestido: patrimonioInicial,
      jurosTotal: 0,
      isPossible: true,
      data: [{
        month: 0,
        patrimonio: patrimonioInicial,
        investido: patrimonioInicial,
        juros: 0
      }]
    };
  }
  
  let pmt: number;
  
  if (r > 0) {
    // PMT = (FV - PV*(1+r)^n) * r / ((1+r)^n - 1)
    const compoundFactor = Math.pow(1 + r, n);
    pmt = (patrimonioObjetivo - patrimonioInicial * compoundFactor) * r / (compoundFactor - 1);
  } else {
    // Taxa = 0
    pmt = (patrimonioObjetivo - patrimonioInicial) / n;
  }
  
  // Verificar se é possível (aporte não pode ser negativo)
  if (pmt < 0 || !isFinite(pmt) || isNaN(pmt)) {
    // Caso especial: PV já cresce mais do que o necessário
    if (pmt < 0) {
      return {
        aporteNecessario: 0,
        totalInvestido: patrimonioInicial,
        jurosTotal: 0,
        isPossible: true,
        errorMessage: 'Seu patrimônio inicial já atingirá o objetivo apenas com os rendimentos!',
        data: simulatePatrimony(patrimonioInicial, 0, taxaAnualPercent, n).data
      };
    }
    
    return {
      aporteNecessario: 0,
      totalInvestido: 0,
      jurosTotal: 0,
      isPossible: false,
      errorMessage: 'Não foi possível calcular o aporte necessário com esses parâmetros.',
      data: []
    };
  }
  
  // Simular para obter dados do gráfico
  const simulation = simulatePatrimony(patrimonioInicial, pmt, taxaAnualPercent, n);
  
  return {
    aporteNecessario: pmt,
    totalInvestido: simulation.totalInvestido,
    jurosTotal: simulation.jurosTotal,
    isPossible: true,
    data: simulation.data
  };
}

// Formatar valor em BRL
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Formatar número compacto para eixo do gráfico
export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return `R$ ${value.toFixed(0)}`;
}
