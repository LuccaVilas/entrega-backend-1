import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:uid", getUserById);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);

export default router;