import usersRouter from "./routes/users.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.routes.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();
initializePassport();

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

await connectDB();

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});