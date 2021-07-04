import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import {
  createTicket,
  findTicket,
  findAndUpdate,
  deleteTicket,
  findTickets,
} from "../services/tickets.service";

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
    const update = req.body;

    const ticket = await findTicket({ ticketId });

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

    const updatedTicket = await findAndUpdate({ ticketId }, update, {
      new: true,
    });

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
    const ticket = await findTicket({ ticketId });

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
    const role = get(req, 'user.role')
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

export async function deletePostHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const postId = get(req, "params.postId");

  const post = await findTicket({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  if (String(post.user) !== String(userId)) {
    return res.sendStatus(401);
  }

  await deleteTicket({ postId });

  return res.sendStatus(200);
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
      status: false,
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
      status: false,
      code: 200,
      message: "ticket retrieved",
      data: tickets,
    });
  } catch (error) {
    return next(error);
  }
};
