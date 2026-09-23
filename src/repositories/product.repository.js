import { productDAO } from "../dao/product.dao.js";

class ProductRepository {
  async getProducts() {
    return await productDAO.getAll();
  }

  async getProductById(id) {
    return await productDAO.getById(id);
  }

  async createProduct(productData) {
    return await productDAO.create(productData);
  }

  async updateProduct(id, productData) {
    return await productDAO.update(id, productData);
  }

  async deleteProduct(id) {
    return await productDAO.delete(id);
  }
}

export const productRepository = new ProductRepository();