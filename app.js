const express = require("express");
const app = express();

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/loan", require("./routes/loanRoutes"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Loan Management System API is running."
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

module.exports = app;
