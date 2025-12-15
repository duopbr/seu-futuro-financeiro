// ============= Financial Calculation Functions (Pure) =============
// Premissas: Aportes mensais no fim do mês, taxa anual convertida para mensal efetiva

export interface SimulationDataPoint {
  month: number;
  patrimonio: number;
  patrimonioReal: number;
  patrimonioSemAportes: number;
  investido: number;
  juros: number;
}

export interface SimulationResult {
  patrimonioFinal: number;
  patrimonioFinalReal: number;
  patrimonioFinalSemAportes: number;
  beneficioAportes: number;
  totalInvestido: number;
  jurosTotal: number;
  jurosTotalReal: number;
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
  patrimonioFinalReal: number;
  totalInvestido: number;
  jurosTotal: number;
  jurosTotalReal: number;
}

export interface RequiredContributionResult {
  aporteNecessario: number;
  totalInvestido: number;
  jurosTotal: number;
  jurosTotalReal: number;
  patrimonioFinalReal: number;
  isPossible: boolean;
  errorMessage?: string;
  data: SimulationDataPoint[];
}

// ============= Core Calculation Functions =============

/**
 * Converts annual rate to effective monthly rate
 * r = (1 + i_annual)^(1/12) - 1
 */
export function annualToMonthlyRate(annualRatePercent: number): number {
  if (annualRatePercent < 0) return 0;
  const annualRateDecimal = annualRatePercent / 100;
  return Math.pow(1 + annualRateDecimal, 1 / 12) - 1;
}

/**
 * Simulates patrimony growth month by month
 */
export function simulateSeries(params: {
  pv: number;
  pmt: number;
  iAnnual: number;
  months: number;
  inflation?: number;
}): SimulationResult {
  const { pv, pmt, iAnnual, months, inflation = 0 } = params;
  
  // Validate inputs
  const safePv = Math.max(0, pv);
  const safePmt = Math.max(0, pmt);
  const safeMonths = Math.max(0, Math.round(months));
  const safeInflation = Math.max(0, inflation);
  
  const r = annualToMonthlyRate(iAnnual);
  const inflacaoMensal = annualToMonthlyRate(safeInflation);
  const data: SimulationDataPoint[] = [];
  
  let saldo = safePv;
  let saldoSemAportes = safePv;
  
  // Initial point (month 0)
  data.push({
    month: 0,
    patrimonio: safePv,
    patrimonioReal: safePv,
    patrimonioSemAportes: safePv,
    investido: safePv,
    juros: 0
  });
  
  for (let m = 1; m <= safeMonths; m++) {
    // Monthly yield + contribution at end of month
    saldo = saldo * (1 + r) + safePmt;
    saldoSemAportes = saldoSemAportes * (1 + r);
    
    const investido = safePv + safePmt * m;
    const juros = saldo - investido;
    
    // Real value (inflation adjusted)
    const fatorInflacao = Math.pow(1 + inflacaoMensal, m);
    const patrimonioReal = saldo / fatorInflacao;
    
    data.push({
      month: m,
      patrimonio: saldo,
      patrimonioReal,
      patrimonioSemAportes: saldoSemAportes,
      investido,
      juros
    });
  }
  
  const totalInvestido = safePv + safePmt * safeMonths;
  const patrimonioFinal = saldo;
  const patrimonioFinalSemAportes = saldoSemAportes;
  const beneficioAportes = patrimonioFinal - patrimonioFinalSemAportes;
  const jurosTotal = patrimonioFinal - totalInvestido;
  
  // Real final value - CORRECTED calculation
  const fatorInflacaoFinal = Math.pow(1 + inflacaoMensal, safeMonths);
  const patrimonioFinalReal = patrimonioFinal / fatorInflacaoFinal;
  const totalInvestidoReal = totalInvestido / fatorInflacaoFinal;
  const jurosTotalReal = patrimonioFinalReal - totalInvestidoReal;
  
  return {
    patrimonioFinal,
    patrimonioFinalReal,
    patrimonioFinalSemAportes,
    beneficioAportes,
    totalInvestido,
    jurosTotal,
    jurosTotalReal,
    data
  };
}

/**
 * Calculates Future Value using formula
 * FV = PV*(1+r)^n + PMT*((1+r)^n - 1)/r
 */
export function futureValue(params: {
  pv: number;
  pmt: number;
  iAnnual: number;
  months: number;
}): number {
  const { pv, pmt, iAnnual, months } = params;
  const r = annualToMonthlyRate(iAnnual);
  const n = months;
  
  if (r === 0) {
    return pv + pmt * n;
  }
  
  const compoundFactor = Math.pow(1 + r, n);
  return pv * compoundFactor + pmt * (compoundFactor - 1) / r;
}

/**
 * Calculates months needed to reach target
 * Returns 'impossible' if goal cannot be reached
 */
export function monthsToTarget(params: {
  pv: number;
  pmt: number;
  iAnnual: number;
  target: number;
}): number | 'impossible' {
  const { pv, pmt, iAnnual, target } = params;
  const r = annualToMonthlyRate(iAnnual);
  
  // Already reached goal
  if (pv >= target) return 0;
  
  // Impossible: no contributions, no rate, and PV < target
  if (pmt <= 0 && r <= 0 && pv < target) {
    return 'impossible';
  }
  
  let n: number;
  
  if (r > 0) {
    // n = ln((FV * r + PMT) / (PV * r + PMT)) / ln(1 + r)
    const numerator = target * r + pmt;
    const denominator = pv * r + pmt;
    
    if (denominator <= 0 || numerator / denominator <= 0) {
      // Use iterative simulation
      n = simulateUntilGoal(pv, pmt, r, target);
    } else {
      n = Math.log(numerator / denominator) / Math.log(1 + r);
    }
  } else if (pmt > 0) {
    // Rate = 0, only contributions
    n = (target - pv) / pmt;
  } else {
    return 'impossible';
  }
  
  // Round up to complete months
  const meses = Math.ceil(n);
  
  // Safety limit (100 years = 1200 months)
  if (meses > 1200 || !isFinite(meses) || isNaN(meses)) {
    return 'impossible';
  }
  
  return meses;
}

/**
 * Calculates required monthly contribution (PMT)
 * PMT = (FV - PV*(1+r)^n) * r / ((1+r)^n - 1)
 */
export function requiredPMT(params: {
  pv: number;
  fv: number;
  iAnnual: number;
  months: number;
}): number | 'not-needed' | 'impossible' {
  const { pv, fv, iAnnual, months } = params;
  const r = annualToMonthlyRate(iAnnual);
  const n = months;
  
  // Already reached goal
  if (pv >= fv) return 'not-needed';
  
  // No time available
  if (n <= 0) return 'impossible';
  
  let pmt: number;
  
  if (r > 0) {
    const compoundFactor = Math.pow(1 + r, n);
    pmt = (fv - pv * compoundFactor) * r / (compoundFactor - 1);
  } else {
    // Rate = 0
    pmt = (fv - pv) / n;
  }
  
  // Negative PMT means initial capital alone exceeds goal
  if (pmt < 0) return 'not-needed';
  
  if (!isFinite(pmt) || isNaN(pmt)) {
    return 'impossible';
  }
  
  return pmt;
}

// ============= High-Level Calculation Functions =============

/**
 * Full simulation with all metadata
 */
export function simulatePatrimony(
  patrimonioInicial: number,
  aporteMensal: number,
  taxaAnualPercent: number,
  prazoMeses: number,
  inflacaoAnualPercent: number = 0
): SimulationResult {
  return simulateSeries({
    pv: patrimonioInicial,
    pmt: aporteMensal,
    iAnnual: taxaAnualPercent,
    months: prazoMeses,
    inflation: inflacaoAnualPercent
  });
}

/**
 * Calculate time to reach goal with full results
 */
export function calculateTimeToGoal(
  patrimonioInicial: number,
  aporteMensal: number,
  taxaAnualPercent: number,
  patrimonioObjetivo: number,
  inflacaoAnualPercent: number = 0
): TimeToGoalResult {
  const months = monthsToTarget({
    pv: patrimonioInicial,
    pmt: aporteMensal,
    iAnnual: taxaAnualPercent,
    target: patrimonioObjetivo
  });
  
  // Already reached goal
  if (months === 0) {
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      estimatedDate: new Date(),
      isPossible: true,
      data: [{
        month: 0,
        patrimonio: patrimonioInicial,
        patrimonioReal: patrimonioInicial,
        patrimonioSemAportes: patrimonioInicial,
        investido: patrimonioInicial,
        juros: 0
      }],
      patrimonioFinal: patrimonioInicial,
      patrimonioFinalReal: patrimonioInicial,
      totalInvestido: patrimonioInicial,
      jurosTotal: 0,
      jurosTotalReal: 0
    };
  }
  
  // Impossible
  if (months === 'impossible') {
    let errorMessage = 'Com esses parâmetros, não é possível atingir o objetivo.';
    
    if (aporteMensal <= 0 && taxaAnualPercent <= 0) {
      errorMessage = 'Adicione aportes mensais ou uma rentabilidade positiva para atingir seu objetivo.';
    } else if (months === 'impossible') {
      errorMessage = 'O prazo estimado excede 100 anos. Considere aumentar aportes ou a rentabilidade.';
    }
    
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      estimatedDate: new Date(),
      isPossible: false,
      errorMessage,
      data: [],
      patrimonioFinal: 0,
      patrimonioFinalReal: 0,
      totalInvestido: 0,
      jurosTotal: 0,
      jurosTotalReal: 0
    };
  }
  
  // Simulate for chart data
  const simulation = simulatePatrimony(
    patrimonioInicial,
    aporteMensal,
    taxaAnualPercent,
    months,
    inflacaoAnualPercent
  );
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  const estimatedDate = new Date();
  estimatedDate.setMonth(estimatedDate.getMonth() + months);
  
  return {
    months,
    years,
    remainingMonths,
    estimatedDate,
    isPossible: true,
    data: simulation.data,
    patrimonioFinal: simulation.patrimonioFinal,
    patrimonioFinalReal: simulation.patrimonioFinalReal,
    totalInvestido: simulation.totalInvestido,
    jurosTotal: simulation.jurosTotal,
    jurosTotalReal: simulation.jurosTotalReal
  };
}

/**
 * Calculate required contribution with full results
 */
export function calculateRequiredContribution(
  patrimonioInicial: number,
  taxaAnualPercent: number,
  patrimonioObjetivo: number,
  prazoMeses: number,
  inflacaoAnualPercent: number = 0
): RequiredContributionResult {
  const pmt = requiredPMT({
    pv: patrimonioInicial,
    fv: patrimonioObjetivo,
    iAnnual: taxaAnualPercent,
    months: prazoMeses
  });
  
  // Already reached goal or no contribution needed
  if (pmt === 'not-needed') {
    const simulation = simulatePatrimony(
      patrimonioInicial,
      0,
      taxaAnualPercent,
      prazoMeses,
      inflacaoAnualPercent
    );
    
    return {
      aporteNecessario: 0,
      totalInvestido: patrimonioInicial,
      jurosTotal: simulation.jurosTotal,
      jurosTotalReal: simulation.jurosTotalReal,
      patrimonioFinalReal: simulation.patrimonioFinalReal,
      isPossible: true,
      errorMessage: 'Seu patrimônio inicial já atingirá o objetivo apenas com os rendimentos!',
      data: simulation.data
    };
  }
  
  // Impossible
  if (pmt === 'impossible') {
    return {
      aporteNecessario: 0,
      totalInvestido: 0,
      jurosTotal: 0,
      jurosTotalReal: 0,
      patrimonioFinalReal: 0,
      isPossible: false,
      errorMessage: 'Não foi possível calcular o aporte necessário com esses parâmetros.',
      data: []
    };
  }
  
  // Simulate for chart data
  const simulation = simulatePatrimony(
    patrimonioInicial,
    pmt,
    taxaAnualPercent,
    prazoMeses,
    inflacaoAnualPercent
  );
  
  return {
    aporteNecessario: pmt,
    totalInvestido: simulation.totalInvestido,
    jurosTotal: simulation.jurosTotal,
    jurosTotalReal: simulation.jurosTotalReal,
    patrimonioFinalReal: simulation.patrimonioFinalReal,
    isPossible: true,
    data: simulation.data
  };
}

// ============= Helper Functions =============

/**
 * Iterative simulation for edge cases
 */
function simulateUntilGoal(
  patrimonioInicial: number,
  aporteMensal: number,
  r: number,
  patrimonioObjetivo: number
): number {
  let saldo = patrimonioInicial;
  let m = 0;
  const maxMonths = 1200; // 100 years
  
  while (saldo < patrimonioObjetivo && m < maxMonths) {
    saldo = saldo * (1 + r) + aporteMensal;
    m++;
  }
  
  return m;
}
