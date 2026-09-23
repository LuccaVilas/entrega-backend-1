import { productRepository } from "../repositories/product.repository.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productRepository.getProducts();

    res.json({
      status: "success",
      products
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      product
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await productRepository.createProduct(req.body);

    res.status(201).json({
      status: "success",
      message: "Producto creado correctamente",
      product
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productRepository.updateProduct(
      req.params.pid,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Producto actualizado correctamente",
      product
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productRepository.deleteProduct(req.params.pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Producto eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};