const mysql = require("mysql2/promise");

let pool;

const createPool = () => {
  if (pool) {
    return pool;
  }

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error("DB_HOST, DB_USER, and DB_NAME are required in environment variables.");
  }

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD || "",
    database: DB_NAME,
    port: Number(DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10
  });

  return pool;
};

const initializeTables = async () => {
  const db = createPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS loans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      tenure INT NOT NULL,
      income DECIMAL(12, 2) NOT NULL,
      credit_score INT NOT NULL,
      interest_rate DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
      emi DECIMAL(12, 2) NOT NULL,
      total_amount DECIMAL(12, 2) NOT NULL,
      risk ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
      status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
      decision_reason VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const connectDB = async () => {
  const db = createPool();
  const connection = await db.getConnection();
  connection.release();
  await initializeTables();
  console.log("MySQL connected");
};

module.exports = {
  connectDB,
  getDB: createPool
};
