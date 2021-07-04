import { Request, Response, NextFunction } from "express";
import { omit, get } from "lodash";
import { create } from "../services/users.service";
import log from "../logger";
import config from "../config";
import { validatePassword, findOneUser } from "../services/users.service";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../services/session.service";
import { sign } from "../utils/jwt.utils";

/**
 *
 * @param req
 * @param res
 * @param next
 * @author validate the email and password
 * @author Create a session
 * @author create access token
 * @author create refresh token
 * @author send refresh & access token back
 * @returns json body
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    log.info(`attempting to log ${req.body.email} into the system`);
    const user = await validatePassword(req.body);
    if (!user) {
      log.info(`Invalid username or password ${req.body.email}`);

      return res.status(401).send({
        status: true,
        code: 401,
        message: "Invalid username or password",
        data: {},
      });
    }
    const session = await createSession(user._id, req.get("user-agent") || "");

    const accessToken = createAccessToken({
      user,
      session,
    });

    const refreshToken = sign(session, {
      expiresIn: config.jwtConfig.tokenExpiresAt,
    });

    log.info(`login successful`);

    return res.status(200).send({
      status: true,
      code: 200,
      message: "login successful",
      data: {
        accessToken,
        refreshToken,
        ...user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = get(req, "user.session");

    await updateSession({ _id: sessionId }, { valid: false });

    return res.status(200).send({
      status: true,
      code: 200,
      message: "successful",
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};

export const getLoggedInSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "user._id");

    const sessions = await findSessions({ user: userId, valid: true });
    return res.status(200).send({
      status: true,
      code: 200,
      message: "user session fetched",
      data: sessions,
    });
  } catch (error) {
    return next(error);
  }
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await create(req.body);
    return res.status(201).send({
      status: true,
      code: 201,
      message: "user created",
      data: omit(user.toJSON(), "password"),
    });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(get(req, "user"))
    const email = get(req, "user.email");

    const user = await findOneUser({ email, active: true });
    return res.status(200).send({
      status: true,
      code: 200,
      message: "user created",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};
