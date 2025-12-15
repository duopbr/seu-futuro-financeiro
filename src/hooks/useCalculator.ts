import { useState, useCallback, useMemo } from 'react';
import {
  simulatePatrimony,
  calculateTimeToGoal,
  calculateRequiredContribution,
  SimulationResult,
  TimeToGoalResult,
  RequiredContributionResult
} from '@/lib/finance';
import { validateCalculatorInputs, CalculatorValidation } from '@/lib/validators';
import { useLeadCapture } from '@/hooks/use-lead-capture';

export type CalculatorMode = 'simulate' | 'timeToGoal' | 'requiredContribution';

export interface CalculatorInputs {
  patrimonioInicial: number;
  aporteMensal: number;
  taxaAnual: number;
  inflacaoAnual: number;
  prazoAnos: number;
  patrimonioObjetivo: number;
  considerarInflacao: boolean;
}

export type CalculatorResult = SimulationResult | TimeToGoalResult | RequiredContributionResult;

const DEFAULT_INPUTS: Record<CalculatorMode, CalculatorInputs> = {
  simulate: {
    patrimonioInicial: 10000,
    aporteMensal: 1000,
    taxaAnual: 10,
    inflacaoAnual: 4.5,
    prazoAnos: 10,
    patrimonioObjetivo: 500000,
    considerarInflacao: false
  },
  timeToGoal: {
    patrimonioInicial: 10000,
    aporteMensal: 1000,
    taxaAnual: 10,
    inflacaoAnual: 4.5,
    prazoAnos: 15,
    patrimonioObjetivo: 500000,
    considerarInflacao: false
  },
  requiredContribution: {
    patrimonioInicial: 10000,
    aporteMensal: 0,
    taxaAnual: 10,
    inflacaoAnual: 4.5,
    prazoAnos: 15,
    patrimonioObjetivo: 500000,
    considerarInflacao: false
  }
};

export function useCalculator(mode: CalculatorMode) {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS[mode]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { isLeadCaptured } = useLeadCapture();
  
  // Validation
  const validation: CalculatorValidation = useMemo(() => {
    return validateCalculatorInputs(
      {
        patrimonioInicial: inputs.patrimonioInicial,
        aporteMensal: inputs.aporteMensal,
        taxaAnual: inputs.taxaAnual,
        prazoAnos: inputs.prazoAnos,
        patrimonioObjetivo: inputs.patrimonioObjetivo,
        inflacaoAnual: inputs.considerarInflacao ? inputs.inflacaoAnual : undefined
      },
      mode
    );
  }, [inputs, mode]);
  
  // Effective inflation
  const inflacaoEfetiva = inputs.considerarInflacao ? inputs.inflacaoAnual : 0;
  
  // Perform calculation
  const performCalculation = useCallback(() => {
    setIsCalculating(true);
    
    // Small delay for UI feedback
    setTimeout(() => {
      let calculationResult: CalculatorResult;
      
      switch (mode) {
        case 'simulate': {
          const prazoMeses = inputs.prazoAnos * 12;
          calculationResult = simulatePatrimony(
            inputs.patrimonioInicial,
            inputs.aporteMensal,
            inputs.taxaAnual,
            prazoMeses,
            inflacaoEfetiva
          );
          break;
        }
        case 'timeToGoal': {
          calculationResult = calculateTimeToGoal(
            inputs.patrimonioInicial,
            inputs.aporteMensal,
            inputs.taxaAnual,
            inputs.patrimonioObjetivo,
            inflacaoEfetiva
          );
          break;
        }
        case 'requiredContribution': {
          const prazoMeses = inputs.prazoAnos * 12;
          calculationResult = calculateRequiredContribution(
            inputs.patrimonioInicial,
            inputs.taxaAnual,
            inputs.patrimonioObjetivo,
            prazoMeses,
            inflacaoEfetiva
          );
          break;
        }
      }
      
      setResult(calculationResult);
      setShowResults(true);
      setIsCalculating(false);
    }, 50);
  }, [inputs, mode, inflacaoEfetiva]);
  
  // Handle calculate button click
  const handleCalculate = useCallback(() => {
    if (!validation.isValid) return;
    
    if (isLeadCaptured()) {
      performCalculation();
    } else {
      setShowLeadDialog(true);
    }
  }, [validation.isValid, isLeadCaptured, performCalculation]);
  
  // Handle lead form submission
  const handleLeadSubmit = useCallback(() => {
    performCalculation();
  }, [performCalculation]);
  
  // Update single input field
  const updateInput = useCallback(<K extends keyof CalculatorInputs>(
    field: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // Reset to defaults
  const reset = useCallback(() => {
    setInputs(DEFAULT_INPUTS[mode]);
    setResult(null);
    setShowResults(false);
  }, [mode]);
  
  return {
    // State
    inputs,
    result,
    showResults,
    showLeadDialog,
    isCalculating,
    validation,
    
    // Actions
    setInputs,
    updateInput,
    setShowLeadDialog,
    handleCalculate,
    handleLeadSubmit,
    reset
  };
}
