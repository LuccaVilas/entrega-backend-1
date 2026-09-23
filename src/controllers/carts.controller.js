import crypto from "crypto";

import { cartRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { ticketRepository } from "../repositories/ticket.repository.js";

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (req.user.cart.toString() !== cid) {
      return res.status(403).json({
        status: "error",
        message: "No podés modificar el carrito de otro usuario"
      });
    }

    const product = await productRepository.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    const cart = await cartRepository.addProduct(cid, pid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      cart
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;

    if (req.user.cart.toString() !== cid) {
      return res.status(403).json({
        status: "error",
        message: "No podés comprar el carrito de otro usuario"
      });
    }

    const cart = await cartRepository.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "El carrito está vacío"
      });
    }

    let total = 0;

    const productsNotPurchased = [];
    const productsPurchased = [];

    for (const item of cart.products) {
      const product = await productRepository.getProductById(
        item.product.toString()
      );

      if (!product) {
        productsNotPurchased.push(item);
        continue;
      }

      if (product.stock >= item.quantity) {
        await productRepository.updateProduct(product._id, {
          stock: product.stock - item.quantity
        });

        total += product.price * item.quantity;

        productsPurchased.push({
          product: product._id,
          title: product.title,
          quantity: item.quantity
        });
      } else {
        productsNotPurchased.push(item);
      }
    }

    await cartRepository.updateCart(cid, {
      products: productsNotPurchased
    });

    if (productsPurchased.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No hay stock suficiente para realizar la compra",
        productsNotPurchased
      });
    }

    const ticket = await ticketRepository.createTicket({
      code: crypto.randomUUID(),
      amount: total,
      purchaser: req.user.email
    });

    res.json({
      status: "success",
      message:
        productsNotPurchased.length > 0
          ? "Compra realizada parcialmente"
          : "Compra realizada correctamente",
      ticket,
      productsPurchased,
      productsNotPurchased
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};