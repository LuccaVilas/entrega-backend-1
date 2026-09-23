import { Router } from "express";
import passport from "passport";

import {
  addProductToCart,
  purchaseCart
} from "../controllers/carts.controller.js";
import { authorizeRoles } from "../middlewares/authorization.js";

const router = Router();

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  authorizeRoles("user"),
  purchaseCart
);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  authorizeRoles("user"),
  addProductToCart
);

export default router;