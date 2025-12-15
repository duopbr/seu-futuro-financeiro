// ============= Formatting Utilities =============

/**
 * Format value as BRL currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format compact number for chart axis
 * Handles negative values correctly
 */
export function formatCompactCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1000000) {
    return `${sign}R$ ${(absValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `${sign}R$ ${(absValue / 1000).toFixed(0)}k`;
  }
  return `${sign}R$ ${absValue.toFixed(0)}`;
}

/**
 * Format percentage with locale
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Format timespan in years and months
 */
export function formatTimespan(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  const parts: string[] = [];
  
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  }
  
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  }
  
  return parts.join(' e ') || '0 meses';
}

/**
 * Format date in Portuguese locale
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Parse BRL currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove R$, dots, and replace comma with dot
  const cleaned = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(cleaned) || 0;
}

/**
 * Format number for display input (Brazilian format)
 */
export function formatInputCurrency(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
