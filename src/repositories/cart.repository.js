import { cartDAO } from "../dao/cart.dao.js";

class CartRepository {
  async getCartById(id) {
    return await cartDAO.getById(id);
  }

  async createCart(cartData) {
    return await cartDAO.create(cartData);
  }

  async updateCart(id, cartData) {
    return await cartDAO.update(id, cartData);
  }

  async addProduct(cartId, productId) {
    const cart = await cartDAO.getById(cartId);

    if (!cart) {
      return null;
    }

    const existingProduct = cart.products.find(
      item => item.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1
      });
    }

    return await cartDAO.update(cartId, {
      products: cart.products
    });
  }
}

export const cartRepository = new CartRepository();