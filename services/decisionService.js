const MAX_EMI_RATIO = 0.4;
const MAX_AMOUNT_RATIO = 24;

const getDecision = ({ risk, income, amount, emi }) => {

  if (income <= 0) {
    return {
      status: "REJECTED",
      reason: "Invalid income provided."
    };
  }

  if (risk === "LOW") {
    return {
      status: "APPROVED",
      reason: "Low-risk borrower based on credit score."
    };
  }

  if (risk === "MEDIUM") {
    const emiToIncomeRatio = Number((emi / income).toFixed(2));
    const amountToIncomeRatio = Number((amount / income).toFixed(2));

    if (
      emiToIncomeRatio <= MAX_EMI_RATIO &&
      amountToIncomeRatio <= MAX_AMOUNT_RATIO
    ) {
      return {
        status: "APPROVED",
        reason: "Medium-risk borrower cleared affordability checks."
      };
    }

    return {
      status: "PENDING",
      reason: "Medium-risk borrower requires admin review."
    };
  }

  return {
    status: "REJECTED",
    reason: "High-risk borrower based on credit score."
  };
};

module.exports = {
  getDecision
};