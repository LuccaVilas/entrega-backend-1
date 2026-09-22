import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya existe"
      });
    }

    const cart = await Cart.create({
      products: []
    });

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cart._id,
      role: "user"
    });

    res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario o contraseña incorrectos"
      });
    }

    const validPassword = isValidPassword(user, password);

    if (!validPassword) {
      return res.status(401).json({
        status: "error",
        message: "Usuario o contraseña incorrectos"
      });
    }

    const token = generateToken(user);

    res.json({
      status: "success",
      message: "Login correcto",
      token
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};