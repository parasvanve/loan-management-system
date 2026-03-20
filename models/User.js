const { getDB } = require("../config/db");

const findByEmail = async (email) => {
  const [rows] = await getDB().execute(
    "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await getDB().execute(
    "SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
};

const create = async ({ name, email, password, role }) => {
  const [result] = await getDB().execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );

  return findById(result.insertId);
};

module.exports = {
  findByEmail,
  findById,
  create
};
