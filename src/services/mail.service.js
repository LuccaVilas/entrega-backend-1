import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendPasswordResetEmail = async (email, resetLink) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Recibimos una solicitud para cambiar tu contraseña.</p>
      <p>El enlace tiene una validez de 1 hora.</p>

      <a href="${resetLink}">
        Restablecer contraseña
      </a>

      <p>Si no solicitaste este cambio, ignorá este correo.</p>
    `
  });
};