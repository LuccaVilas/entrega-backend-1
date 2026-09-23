import { Ticket } from "../models/ticket.model.js";

class TicketDAO {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getById(id) {
    return await Ticket.findById(id);
  }

  async getAll() {
    return await Ticket.find();
  }
}

export const ticketDAO = new TicketDAO();