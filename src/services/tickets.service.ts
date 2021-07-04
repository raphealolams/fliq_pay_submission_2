import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Ticket, { TicketDocument } from "../models/tickets.model";

export const createTicket = (input: DocumentDefinition<TicketDocument>) => {
  return Ticket.create(input);
};

export const findTicket = (
  query: FilterQuery<TicketDocument>,
  options: QueryOptions = { lean: true }
) => {
  return Ticket.findOne(query, {}, options);
};

export const findTickets = (
  query: FilterQuery<TicketDocument>,
  options: QueryOptions = { lean: true }
) => {
  return Ticket.find(query, {}, options);
};

export const findAndUpdate = (
  query: FilterQuery<TicketDocument>,
  update: UpdateQuery<TicketDocument>,
  options: QueryOptions
) => {
  return Ticket.findOneAndUpdate(query, update, options);
};

export const deleteTicket = (query: FilterQuery<TicketDocument>) => {
  return Ticket.deleteOne(query);
};
