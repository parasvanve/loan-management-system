const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/helpers");

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    let { name, email, password, role, adminKey } = req.body;

    name = name?.trim();
    email = email?.trim();

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, "User already exists with this email.", 409);
    }

    let assignedRole = "USER";
    if (
      role === "ADMIN" &&
      adminKey &&
      adminKey === process.env.ADMIN_REGISTRATION_KEY
    ) {
      assignedRole = "ADMIN";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    const token = createToken(user);

    return successResponse(
      res,
      "User registered successfully.",
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      201
    );
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return errorResponse(res, "Email already exists.", 409);
    }

    return errorResponse(res, "Unable to register user.", 500);
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();

    const user = await User.findByEmail(email);

    if (!user) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    if (typeof password !== "string") {
      return errorResponse(res, "Invalid password format.", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password.", 401);
    }

    const token = createToken(user);

    return successResponse(res, "Login successful.", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Unable to login.", 500);
  }
};

module.exports = {
  register,
  login
};