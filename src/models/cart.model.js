import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: Array,
    default: []
  }
});

export const Cart = mongoose.model("Cart", cartSchema);