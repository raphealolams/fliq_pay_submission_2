import express from "express";
import {
    createTicketHandler, closeTicketHandler,
    getMyTicketsHandler, getTicketHandler, getTicketsHandler
} from "../controllers/tickets.controller";
import validate from "../middleware/validator";
import { requiresUser, requiresAdmin } from "../middleware/auth";
import { createTicketSchema, updateTicketSchema, getTicketSchema } from "../schema/tickets.schema";

const router = express.Router();

router.post(
  "/v1/tickets/create",
  [requiresUser,
  validate(createTicketSchema)],
  createTicketHandler
);
router.get("/v1/tickets", requiresAdmin, getTicketsHandler);
router.get("/v1/tickets/:ticketId", [requiresAdmin, validate(getTicketSchema)], getTicketHandler);
router.get("/v1/tickets/me", requiresUser, getMyTicketsHandler);
router.get("/v1/tickets/report", requiresUser, ticket.generateTicketReport);
router.put("/v1/tickets/close-ticket", requiresUser, validate(updateTicketSchema) closeTicketHandler);

export { router as usersRoutes };
