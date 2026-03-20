const getDecision = ({ risk, income, amount, emi }) => {
  if (risk === "LOW") {
    return {
      status: "APPROVED",
      reason: "Low-risk borrower based on credit score."
    };
  }

  if (risk === "MEDIUM") {
    const emiToIncomeRatio = emi / income;
    const amountToIncomeRatio = amount / income;

    if (emiToIncomeRatio <= 0.4 && amountToIncomeRatio <= 24) {
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
