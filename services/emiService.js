const roundCurrency = (value) => Number(value.toFixed(2));

const calculateEMI = (principal, annualRate = 10, tenureMonths) => {
  const monthlyRate = annualRate / (12 * 100);

  if (!monthlyRate) {
    return roundCurrency(principal / tenureMonths);
  }

  const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi =
    (principal * monthlyRate * compoundFactor) /
    (compoundFactor - 1);

  return roundCurrency(emi);
};

const calculateTotalAmount = (emi, tenureMonths) =>
  roundCurrency(emi * tenureMonths);

module.exports = {
  calculateEMI,
  calculateTotalAmount
};
