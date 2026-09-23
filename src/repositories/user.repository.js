import { userDAO } from "../dao/user.dao.js";

class UserRepository {
  async getUsers() {
    return await userDAO.getAll();
  }

  async getUserById(id) {
    return await userDAO.getById(id);
  }

  async getUserByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async createUser(userData) {
    return await userDAO.create(userData);
  }

  async updateUser(id, userData) {
    return await userDAO.update(id, userData);
  }

  async deleteUser(id) {
    return await userDAO.delete(id);
  }
}

export const userRepository = new UserRepository();