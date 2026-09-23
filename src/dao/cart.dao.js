import { Cart } from "../models/cart.model.js";

class CartDAO {
  async getById(id) {
    return await Cart.findById(id);
  }

  async create(cartData = { products: [] }) {
    return await Cart.create(cartData);
  }

  async update(id, cartData) {
    return await Cart.findByIdAndUpdate(
      id,
      cartData,
      { new: true }
    );
  }
}

export const cartDAO = new CartDAO();