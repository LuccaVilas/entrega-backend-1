import { ticketDAO } from "../dao/ticket.dao.js";

class TicketRepository {
  async createTicket(ticketData) {
    return await ticketDAO.create(ticketData);
  }

  async getTicketById(id) {
    return await ticketDAO.getById(id);
  }

  async getTickets() {
    return await ticketDAO.getAll();
  }
}

export const ticketRepository = new TicketRepository();