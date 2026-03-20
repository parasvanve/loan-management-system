const { getDB } = require("../config/db");

const findByEmail = async (email) => {
  try {
    const db = getDB();
    email = email?.trim().toLowerCase();

    const [rows] = await db.execute(
      "SELECT id, name, email, password, role FROM users WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );

    return rows[0] || null;
  } catch (error) {
    console.error("findByEmail error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const db = getDB();

    const [rows] = await db.execute(
      "SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] || null;
  } catch (error) {
    console.error("findById error:", error);
    throw error;
  }
};

const create = async ({ name, email, password, role }) => {
  try {
    if (!name || !email || !password) {
      throw new Error("Invalid user data");
    }

    const db = getDB();

    email = email.trim().toLowerCase();
    name = name.trim();

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );

    return findById(result.insertId);
  } catch (error) {
    console.error("create user error:", error);
    throw error;
  }
};

module.exports = {
  findByEmail,
  findById,
  create
};