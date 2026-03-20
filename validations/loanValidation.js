const { errorResponse } = require("../utils/helpers");

const validateLoan = (req, res, next) => {
  let { amount, tenure, income, creditScore } = req.body;

  amount = Number(amount);
  tenure = Number(tenure);
  income = Number(income);
  creditScore = Number(creditScore);

  if (
    amount === undefined ||
    tenure === undefined ||
    income === undefined ||
    creditScore === undefined
  ) {
    return errorResponse(res, "All fields are required.", 400);
  }

  if (
    isNaN(amount) ||
    isNaN(tenure) ||
    isNaN(income) ||
    isNaN(creditScore)
  ) {
    return errorResponse(res, "Invalid numeric values.", 400);
  }

  if (amount <= 0 || tenure <= 0 || income <= 0) {
    return errorResponse(res, "Amount, tenure, and income must be greater than 0.", 400);
  }

  if (creditScore < 300 || creditScore > 900) {
    return errorResponse(res, "Credit score must be between 300 and 900.", 400);
  }

  if (amount > 100000000) {
    return errorResponse(res, "Loan amount too large.", 400);
  }

  if (tenure > 360) {
    return errorResponse(res, "Tenure too long.", 400);
  }

  return next();
};

const validateLoanStatus = (req, res, next) => {
  const { status } = req.body;

  const validStatus = ["APPROVED", "REJECTED", "PENDING"];

  if (!status) {
    return errorResponse(res, "Status is required.", 400);
  }

  if (!validStatus.includes(status)) {
    return errorResponse(res, "Invalid status value.", 400);
  }

  return next();
};

module.exports = {
  validateLoan,
  validateLoanStatus
};

