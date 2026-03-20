const { getDB } = require("../config/db");

const normalizeLoan = (row) => ({
  id: row.id,
  userId: row.user_id,
  amount: Number(row.amount),
  tenure: row.tenure,
  income: Number(row.income),
  creditScore: row.credit_score,
  interestRate: Number(row.interest_rate),
  emi: Number(row.emi),
  totalAmount: Number(row.total_amount),
  risk: row.risk,
  status: row.status,
  decisionReason: row.decision_reason,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  ...(row.user_name
    ? {
        user: {
          id: row.user_ref_id,
          name: row.user_name,
          email: row.user_email,
          role: row.user_role
        }
      }
    : {})
});

const create = async ({
  userId,
  amount,
  tenure,
  income,
  creditScore,
  interestRate,
  emi,
  totalAmount,
  risk,
  status,
  decisionReason
}) => {
  const [result] = await getDB().execute(
    `INSERT INTO loans
      (user_id, amount, tenure, income, credit_score, interest_rate, emi, total_amount, risk, status, decision_reason)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      amount,
      tenure,
      income,
      creditScore,
      interestRate,
      emi,
      totalAmount,
      risk,
      status,
      decisionReason
    ]
  );

  return findById(result.insertId);
};

const findById = async (id) => {
  const [rows] = await getDB().execute("SELECT * FROM loans WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? normalizeLoan(rows[0]) : null;
};

const findByIdWithUser = async (id) => {
  const [rows] = await getDB().execute(
    `SELECT l.*, u.id AS user_ref_id, u.name AS user_name, u.email AS user_email, u.role AS user_role
     FROM loans l
     JOIN users u ON u.id = l.user_id
     WHERE l.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ? normalizeLoan(rows[0]) : null;
};

const findByUserId = async (userId) => {
  const [rows] = await getDB().execute(
    "SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  return rows.map(normalizeLoan);
};

const findAll = async () => {
  const [rows] = await getDB().execute(
    `SELECT l.*, u.id AS user_ref_id, u.name AS user_name, u.email AS user_email, u.role AS user_role
     FROM loans l
     JOIN users u ON u.id = l.user_id
     ORDER BY l.created_at DESC`
  );

  return rows.map(normalizeLoan);
};

const updateStatus = async (id, status, decisionReason) => {
  await getDB().execute(
    "UPDATE loans SET status = ?, decision_reason = ? WHERE id = ?",
    [status, decisionReason, id]
  );

  return findByIdWithUser(id);
};

module.exports = {
  create,
  findById,
  findByIdWithUser,
  findByUserId,
  findAll,
  updateStatus
};
