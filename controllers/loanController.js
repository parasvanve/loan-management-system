const Loan = require("../models/Loan");
const User = require("../models/User");
const { calculateEMI, calculateTotalAmount } = require("../services/emiService");
const { getRisk } = require("../services/riskService");
const { getDecision } = require("../services/decisionService");
const { sendEmail } = require("../services/emailService");
const { successResponse, errorResponse } = require("../utils/helpers");

const INTEREST_RATE = 10;

const applyLoan = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return errorResponse(res, "Unauthorized", 401);
    }

    let { amount, tenure, income, creditScore } = req.body;

    amount = Number(amount);
    tenure = Number(tenure);
    income = Number(income);
    creditScore = Number(creditScore);

    if (
      isNaN(amount) ||
      isNaN(tenure) ||
      isNaN(income) ||
      isNaN(creditScore)
    ) {
      return errorResponse(res, "Invalid input values", 400);
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, "User not found.", 404);
    }

    const emi = calculateEMI(amount, INTEREST_RATE, tenure);
    const totalAmount = calculateTotalAmount(emi, tenure);
    const risk = getRisk(creditScore);

    const decision = getDecision({
      risk,
      income,
      amount,
      emi
    });

    const loan = await Loan.create({
      userId: user.id,
      amount,
      tenure,
      income,
      creditScore,
      interestRate: INTEREST_RATE,
      emi,
      totalAmount,
      risk,
      status: decision.status,
      decisionReason: decision.reason
    });

    try {
      await sendEmail({
      to: user.email,
      subject: "Loan application received",
      text: `Your loan application has been processed with status ${loan.status}. EMI: ${loan.emi}, Risk: ${loan.risk}.`,
      html: `<p>Your loan application has been processed.</p><p>Status: <strong>${loan.status}</strong></p><p>EMI: ${loan.emi}</p><p>Risk: ${loan.risk}</p>`
    });
    } catch (e) {
      console.error("Email failed:", e);
    }

    return successResponse(res, "Loan applied successfully.", loan, 201);

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Unable to apply for loan.", 500);
  }
};

const myLoans = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const loans = await Loan.findByUserId(req.user.id);
    return successResponse(res, "Loans fetched successfully.", loans);

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Unable to fetch user loans.", 500);
  }
};

const allLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    return successResponse(res, "All loans fetched successfully.", loans);

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Unable to fetch all loans.", 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ["APPROVED", "REJECTED", "PENDING"];
    if (!validStatus.includes(status)) {
      return errorResponse(res, "Invalid status", 400);
    }

    const loan = await Loan.findByIdWithUser(req.params.id);

    if (!loan) {
      return errorResponse(res, "Loan not found.", 404);
    }

    const decisionReason =
      status === "APPROVED"
        ? "Loan approved by admin."
        : status === "REJECTED"
          ? "Loan rejected by admin."
          : "Loan moved to pending review.";

    const updatedLoan = await Loan.updateStatus(
      req.params.id,
      status,
      decisionReason
    );

    try {
      await sendEmail({
      to: updatedLoan.user.email,
      subject: `Loan ${updatedLoan.status.toLowerCase()}`,
      text: `Your loan application status is now ${updatedLoan.status}.`,
      html: `<p>Hello ${updatedLoan.user.name},</p><p>Your loan status is now <strong>${updatedLoan.status}</strong>.</p>`
    });
    } catch (e) {
      console.error("Email failed:", e);
    }

    return successResponse(res, "Loan status updated.", updatedLoan);

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Unable to update loan status.", 500);
  }
};

module.exports = {
  applyLoan,
  myLoans,
  allLoans,
  updateStatus
};