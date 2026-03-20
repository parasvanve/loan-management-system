const Loan = require("../models/Loan");
const User = require("../models/User");
const { calculateEMI, calculateTotalAmount } = require("../services/emiService");
const { getRisk } = require("../services/riskService");
const { getDecision } = require("../services/decisionService");
const { sendEmail } = require("../services/emailService");
const { successResponse, errorResponse } = require("../utils/helpers");

const applyLoan = async (req, res) => {
  try {
    const { amount, tenure, income, creditScore } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, "User not found.", 404);
    }

    const emi = calculateEMI(Number(amount), 10, Number(tenure));
    const totalAmount = calculateTotalAmount(emi, Number(tenure));
    const risk = getRisk(Number(creditScore));
    const decision = getDecision({
      risk,
      income: Number(income),
      amount: Number(amount),
      emi
    });

    const loan = await Loan.create({
      userId: user.id,
      amount: Number(amount),
      tenure: Number(tenure),
      income: Number(income),
      creditScore: Number(creditScore),
      interestRate: 10,
      emi,
      totalAmount,
      risk,
      status: decision.status,
      decisionReason: decision.reason
    });

    await sendEmail({
      to: user.email,
      subject: "Loan application received",
      text: `Your loan application has been processed with status ${loan.status}. EMI: ${loan.emi}, Risk: ${loan.risk}.`,
      html: `<p>Your loan application has been processed.</p><p>Status: <strong>${loan.status}</strong></p><p>EMI: ${loan.emi}</p><p>Risk: ${loan.risk}</p>`
    });

    return successResponse(
      res,
      "Loan application submitted successfully.",
      loan,
      201
    );
  } catch (error) {
    return errorResponse(res, "Unable to apply for loan.", 500);
  }
};

const myLoans = async (req, res) => {
  try {
    const loans = await Loan.findByUserId(req.user.id);
    return successResponse(res, "Loans fetched successfully.", loans);
  } catch (error) {
    return errorResponse(res, "Unable to fetch user loans.", 500);
  }
};

const allLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();

    return successResponse(res, "All loans fetched successfully.", loans);
  } catch (error) {
    return errorResponse(res, "Unable to fetch all loans.", 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await Loan.findByIdWithUser(req.params.id);

    if (!loan) {
      return errorResponse(res, "Loan not found.", 404);
    }

    const decisionReason =
      status === "APPROVED"
        ? "Loan approved by admin."
        : status === "REJECTED"
          ? "Loan rejected by admin."
          : "Loan moved to pending review by admin.";

    const updatedLoan = await Loan.updateStatus(req.params.id, status, decisionReason);

    await sendEmail({
      to: updatedLoan.user.email,
      subject: `Loan ${updatedLoan.status.toLowerCase()}`,
      text: `Your loan application status is now ${updatedLoan.status}.`,
      html: `<p>Hello ${updatedLoan.user.name},</p><p>Your loan status is now <strong>${updatedLoan.status}</strong>.</p>`
    });

    return successResponse(res, "Loan status updated successfully.", updatedLoan);
  } catch (error) {
    return errorResponse(res, "Unable to update loan status.", 500);
  }
};

module.exports = {
  applyLoan,
  myLoans,
  allLoans,
  updateStatus
};
