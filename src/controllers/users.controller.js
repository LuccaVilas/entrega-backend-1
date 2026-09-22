import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      status: "success",
      users
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.json({
      status: "success",
      user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.uid,
      req.body,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Usuario actualizado",
      user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.uid);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Usuario eliminado"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};