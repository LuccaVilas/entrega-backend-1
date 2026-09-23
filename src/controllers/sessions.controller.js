import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../services/mail.service.js";
import { cartRepository } from "../repositories/cart.repository.js";
import {
  createHash,
  isValidPassword
} from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { userRepository } from "../repositories/user.repository.js";

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await userRepository.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya existe"
      });
    }

    const cart = await cartRepository.createCart({
      products: []
    });

  const user = await userRepository.createUser({
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
    const user = req.user;

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink =
      `${process.env.BASE_URL}/api/sessions/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, resetLink);

    res.json({
      status: "success",
      message: "Correo de recuperación enviado"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token requerido"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await userRepository.getUserById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    const samePassword = isValidPassword(user, password);

    if (samePassword) {
      return res.status(400).json({
        status: "error",
        message: "La nueva contraseña no puede ser igual a la anterior"
      });
    }

    await userRepository.updateUser(user._id, {
      password: createHash(password)
    });

    res.json({
      status: "success",
      message: "Contraseña actualizada correctamente"
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "El enlace de recuperación expiró"
      });
    }

    res.status(401).json({
      status: "error",
      message: "Token inválido"
    });
  }
};