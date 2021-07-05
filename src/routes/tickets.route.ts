import express from "express";
import {
    createTicketHandler, closeTicketHandler,
    getMyTicketsHandler, getTicketHandler, getTicketsHandler, saveComment
} from "../controllers/tickets.controller";
import validate from "../middleware/validator";
import { requiresUser, requiresAdmin, requiresBoth } from "../middleware/auth";
import { createTicketSchema, commentSchema, getTicketSchema } from "../schema/tickets.schema";

const router = express.Router();

router.post(
  "/v1/tickets/create",
  [requiresUser,
  validate(createTicketSchema)],
  createTicketHandler
);
router.get("/v1/tickets/me", requiresUser, getMyTicketsHandler);
router.get("/v1/tickets/me/:ticketId", [requiresUser, validate(getTicketSchema)], getTicketHandler);

router.get("/v1/tickets/:ticketId", [requiresAdmin, validate(getTicketSchema)], getTicketHandler);

router.get("/v1/tickets", requiresAdmin, getTicketsHandler);

router.patch('/v1/tickets/comment/:ticketId', [requiresBoth, validate(commentSchema)], saveComment)
router.put("/v1/tickets/:ticketId", requiresAdmin, closeTicketHandler);

export { router as TicketsRoutes };
