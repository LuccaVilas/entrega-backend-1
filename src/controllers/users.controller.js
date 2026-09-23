import { userRepository } from "../repositories/user.repository.js";
import { UserDTO } from "../dto/user.dto.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userRepository.getUsers();

    res.json({
      status: "success",
      users: users.map(user => new UserDTO(user))
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
    const user = await userRepository.getUserById(req.params.uid);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.json({
      status: "success",
      user: new UserDTO(user)
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
    const user = await userRepository.updateUser(
      req.params.uid,
      req.body
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Usuario actualizado",
      user: new UserDTO(user)
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
    const user = await userRepository.deleteUser(req.params.uid);

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