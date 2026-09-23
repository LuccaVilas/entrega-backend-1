import { Router } from "express";
import passport from "passport";

import {
  register,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/sessions.controller.js";

import { UserDTO } from "../dto/user.dto.js";

const router = Router();

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  login
);

router.post("/forgot-password", forgotPassword);

router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token no encontrado");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Restablecer contraseña</title>
      </head>
      <body>
        <h2>Restablecer contraseña</h2>

        <form method="POST" action="/api/sessions/reset-password?token=${token}">
          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            required
          />

          <button type="submit">
            Cambiar contraseña
          </button>
        </form>
      </body>
    </html>
  `);
});
router.post("/reset-password", resetPassword);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);

    res.json({
      status: "success",
      user: userDTO
    });
  }
);

export default router;