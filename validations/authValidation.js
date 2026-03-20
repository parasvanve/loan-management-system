const { errorResponse } = require("../utils/helpers");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validateRegister = (req, res, next) => {
  let { name, email, password } = req.body;

  name = name?.trim();
  email = email?.trim();

  req.body.name = name;
  req.body.email = email;

  if (!name || !email || !password) {
    return errorResponse(res, "Name, email, and password are required.", 400);
  }

  if (name.length < 2) {
    return errorResponse(res, "Name must be at least 2 characters long.", 400);
  }

  if (!emailRegex.test(email)) {
    return errorResponse(res, "Invalid email format.", 400);
  }

  if (typeof password !== "string" || password.length < 6) {
    return errorResponse(res, "Password must be at least 6 characters long.", 400);
  }

  return next();
};

const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  email = email?.trim();
  req.body.email = email;

  if (!email || !password) {
    return errorResponse(res, "Email and password are required.", 400);
  }

  if (!emailRegex.test(email)) {
    return errorResponse(res, "Invalid email format.", 400);
  }

  if (typeof password !== "string") {
    return errorResponse(res, "Invalid password format.", 400);
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin
};