const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/helpers");

const createToken = (user) =>
  jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, "User already exists with this email.", 409);
    }

    const assignedRole =
      role === "ADMIN" && adminKey && adminKey === process.env.ADMIN_REGISTRATION_KEY
        ? "ADMIN"
        : "USER";

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
    return errorResponse(res, "Unable to register user.", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return errorResponse(res, "Invalid email or password.", 401);
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
    return errorResponse(res, "Unable to login.", 500);
  }
};

module.exports = {
  register,
  login
};
