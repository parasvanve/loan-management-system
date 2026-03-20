const validateLoan = (req, res, next) => {
  const { amount, tenure, income, creditScore } = req.body;

  if (
    amount === undefined ||
    tenure === undefined ||
    income === undefined ||
    creditScore === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Amount, tenure, income, and credit score are required."
    });
  }

  if ([amount, tenure, income, creditScore].some((value) => Number(value) <= 0)) {
    return res.status(400).json({
      success: false,
      message: "Loan inputs must be positive numbers."
    });
  }

  next();
};

const validateLoanStatus = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be PENDING, APPROVED, or REJECTED."
    });
  }

  next();
};

module.exports = {
  validateLoan,
  validateLoanStatus
};
