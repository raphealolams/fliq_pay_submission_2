import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createTicket,
  findTicket,
  findAndUpdate,
  findTickets,
} from "../services/tickets.service";

const ROLES = ["admin", "agent"];

export async function createTicketHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = get(req, "user._id");
    const body = req.body;
    const ticket = await createTicket({ ...body, user: userId });

    return res.send({
      status: true,
      code: 201,
      message: "ticket created",
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
}

export const closeTicketHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "user._id");
    const userRole = get(req, "user.role");
    const ticketId = get(req, "params.ticketId");
    const ticket = await findTicket({ _id: ticketId });

    if (!ticket) {
      return res.status(404).send({
        status: false,
        code: 404,
        message: "invalid ticket id",
        data: {},
      });
    }

    if (String(ticket.user) === userId || userRole === "user") {
      return res.status(406).send({
        status: false,
        code: 406,
        message: "you update a ticket created by you",
        data: {},
      });
    }

    const updatedTicket = await findAndUpdate(
      { _id: ticketId },
      { status: "closed" },
      {
        new: true,
      }
    );

    return res.status(200).send({
      status: false,
      code: 200,
      message: "ticket closed",
      data: updatedTicket,
    });
  } catch (error) {
    return next(error);
  }
};

export async function getTicketHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ticketId = get(req, "params.ticketId");
    const ticket = await findTicket({ _id: ticketId });

    if (!ticket) {
      return res.status(404).send({
        status: true,
        code: 404,
        message: "ticket does not exist",
        data: {},
      });
    }

    return res.status(200).send({
      status: true,
      code: 200,
      message: "ticket found",
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTicketsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ticket = await findTickets({});
    return res.status(200).send({
      status: true,
      code: 200,
      message: "ticket found",
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next handler
 * @author function that get tickets that belongs to a user
 * @author accepts user token from the auth header to fetch tickets if the user is logged-in
 * @author protected route
 */
export const getMyTicketsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "user._id");

    const tickets = await findTickets({ user: userId });
    return res.status(200).send({
      status: true,
      code: 200,
      message: "ticket retrieved",
      data: tickets,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next handler
 * @author accepts a query string if admin or support agent try's to use it to get user's ticket
 * @author protected route
 */
export const getUserTicketsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "query.userId");

    const tickets = await findTickets({ user: userId });
    return res.status(200).send({
      status: true,
      code: 200,
      message: "ticket retrieved",
      data: tickets,
    });
  } catch (error) {
    return next(error);
  }
};

export const saveComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "user._id");
    const userRole = get(req, "user.role");
    const ticketId = get(req, "params.ticketId");
    const body = req.body;

    const ticket = await findTicket({ _id: body.ticketId });

    if (!ticket) {
      return res.status(404).send({
        status: false,
        code: 404,
        message: "invalid ticket id",
        data: {},
      });
    }

    if (ticket.comments.length === 0 && userRole === "user") {
      return res.status(406).send({
        status: false,
        code: 406,
        message: "You can't comment unless a support agent does",
        data: {},
      });
    }

    if (
      ticket.comments.length > 0 ||
      (ROLES.includes(userRole) && ticket.comments.length === 0)
    ) {
      const updatedTicket = await findAndUpdate(
        { _id: ticketId },
        {
          $addToSet: {
            comments: {
              comment: body.comment,
              author: userRole,
              user: userId,
            },
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).send({
        status: true,
        code: 200,
        message: "ticket closed",
        data: updatedTicket,
      });
    }

    return res.status(422).send({
      status: false,
      code: 422,
      message: "error saving comment",
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};
