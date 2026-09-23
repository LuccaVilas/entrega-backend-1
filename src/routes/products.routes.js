import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  authorizeRoles("admin"),
  createProduct
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authorizeRoles("admin"),
  updateProduct
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  authorizeRoles("admin"),
  deleteProduct
);

export default router;