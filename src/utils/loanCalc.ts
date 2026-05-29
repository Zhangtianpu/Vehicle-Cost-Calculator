import type { LoanParams, LoanResult } from "@/types";

export function calculateLoanCost(params: LoanParams): LoanResult {
  const { vehiclePrice, downPaymentRatio, loanTermMonths, annualRate, repaymentMethod } = params;
  const downPayment = vehiclePrice * downPaymentRatio;
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0 || loanTermMonths <= 0) {
    return {
      monthlyCost: 0,
      yearlyCost: 0,
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: downPayment,
      downPayment,
      loanAmount: 0,
    };
  }

  if (repaymentMethod === "equal_installment") {
    return calculateEqualInstallment(loanAmount, monthlyRate, loanTermMonths, downPayment);
  } else {
    return calculateEqualPrincipal(loanAmount, monthlyRate, loanTermMonths, downPayment);
  }
}

function calculateEqualInstallment(
  loanAmount: number,
  monthlyRate: number,
  months: number,
  downPayment: number
): LoanResult {
  let monthlyPayment: number;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / months;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - loanAmount;
  const yearlyCost = monthlyPayment * 12;

  return {
    monthlyCost: Math.round(yearlyCost / 12 * 100) / 100,
    yearlyCost: Math.round(yearlyCost * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
  };
}

function calculateEqualPrincipal(
  loanAmount: number,
  monthlyRate: number,
  months: number,
  downPayment: number
): LoanResult {
  const monthlyPrincipal = loanAmount / months;
  let totalInterest = 0;

  for (let i = 0; i < months; i++) {
    const remaining = loanAmount - monthlyPrincipal * i;
    totalInterest += remaining * monthlyRate;
  }

  const totalPayment = loanAmount + totalInterest;
  const firstMonthPayment = monthlyPrincipal + loanAmount * monthlyRate;
  const yearlyCost = firstMonthPayment * 12;

  return {
    monthlyCost: Math.round(yearlyCost / 12 * 100) / 100,
    yearlyCost: Math.round(yearlyCost * 100) / 100,
    monthlyPayment: Math.round(firstMonthPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
  };
}
