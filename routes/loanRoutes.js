const express = require("express");
const router = express.Router();
const loan = require("../controllers/loanController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  validateLoan,
  validateLoanStatus
} = require("../validations/loanValidation");

router.post("/apply", auth, validateLoan, loan.applyLoan);
router.get("/my-loans", auth, loan.myLoans);

router.get("/all", auth, role("ADMIN"), loan.allLoans);
router.patch("/:id/status", auth, role("ADMIN"), validateLoanStatus, loan.updateStatus);

module.exports = router;
