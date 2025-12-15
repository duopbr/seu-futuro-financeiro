// ============= Validation Utilities =============

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate that value is positive (> 0)
 */
export function validatePositive(value: number, fieldName: string): ValidationResult {
  if (value <= 0) {
    return {
      isValid: false,
      error: `${fieldName} deve ser maior que zero`
    };
  }
  return { isValid: true };
}

/**
 * Validate that value is non-negative (>= 0)
 */
export function validateNonNegative(value: number, fieldName: string): ValidationResult {
  if (value < 0) {
    return {
      isValid: false,
      error: `${fieldName} não pode ser negativo`
    };
  }
  return { isValid: true };
}

/**
 * Validate that value is within range [min, max]
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} deve estar entre ${min} e ${max}`
    };
  }
  return { isValid: true };
}

/**
 * Validate that value is not zero
 */
export function validateNonZero(value: number, fieldName: string): ValidationResult {
  if (value === 0) {
    return {
      isValid: false,
      error: `${fieldName} não pode ser zero`
    };
  }
  return { isValid: true };
}

/**
 * Combined validation for calculator inputs
 */
export interface CalculatorInputs {
  patrimonioInicial?: number;
  aporteMensal?: number;
  taxaAnual?: number;
  prazoAnos?: number;
  patrimonioObjetivo?: number;
  inflacaoAnual?: number;
}

export interface CalculatorValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCalculatorInputs(
  inputs: CalculatorInputs,
  mode: 'simulate' | 'timeToGoal' | 'requiredContribution'
): CalculatorValidation {
  const errors: Record<string, string> = {};
  
  // Common validations
  if (inputs.patrimonioInicial !== undefined && inputs.patrimonioInicial < 0) {
    errors.patrimonioInicial = 'Patrimônio inicial não pode ser negativo';
  }
  
  if (inputs.aporteMensal !== undefined && inputs.aporteMensal < 0) {
    errors.aporteMensal = 'Aporte mensal não pode ser negativo';
  }
  
  if (inputs.taxaAnual !== undefined) {
    if (inputs.taxaAnual < 0) {
      errors.taxaAnual = 'Taxa anual não pode ser negativa';
    } else if (inputs.taxaAnual > 100) {
      errors.taxaAnual = 'Taxa anual não pode exceder 100%';
    }
  }
  
  if (inputs.inflacaoAnual !== undefined) {
    if (inputs.inflacaoAnual < 0) {
      errors.inflacaoAnual = 'Inflação não pode ser negativa';
    } else if (inputs.inflacaoAnual > 50) {
      errors.inflacaoAnual = 'Inflação não pode exceder 50%';
    }
  }
  
  // Mode-specific validations
  if (mode === 'simulate' || mode === 'requiredContribution') {
    if (inputs.prazoAnos !== undefined) {
      if (inputs.prazoAnos < 1) {
        errors.prazoAnos = 'Prazo deve ser de pelo menos 1 ano';
      } else if (inputs.prazoAnos > 100) {
        errors.prazoAnos = 'Prazo não pode exceder 100 anos';
      }
    }
  }
  
  if (mode === 'timeToGoal' || mode === 'requiredContribution') {
    if (inputs.patrimonioObjetivo !== undefined && inputs.patrimonioObjetivo <= 0) {
      errors.patrimonioObjetivo = 'Patrimônio objetivo deve ser maior que zero';
    }
  }
  
  // Business rule: at least some input for growth
  if (mode === 'simulate') {
    const hasGrowthSource = 
      (inputs.aporteMensal ?? 0) > 0 || 
      (inputs.taxaAnual ?? 0) > 0 ||
      (inputs.patrimonioInicial ?? 0) > 0;
    
    if (!hasGrowthSource) {
      errors.general = 'Informe um patrimônio inicial, aporte mensal ou rentabilidade';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
