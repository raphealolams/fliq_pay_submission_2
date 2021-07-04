import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import config from "../config";
import { get } from "lodash";
import { UserDocument } from "../models/users.model";
import Session, { SessionDocument } from "../models/session.model";
import { sign, decode } from "../utils/jwt.utils";
import { findOneUser } from "./users.service";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
};

/**
 *
 * @param param0
 * @returns
 * @author Build and return the new access token
 */
export const createAccessToken = async ({
  user,
  session,
}: {
  user:
    | Omit<UserDocument, "password">
    | LeanDocument<Omit<UserDocument, "password">>;
  session:
    | Omit<SessionDocument, "password">
    | LeanDocument<Omit<SessionDocument, "password">>;
}) => {
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.jwtConfig.tokenExpiresAt }
  );

  return accessToken;
};
/**
 *
 * @param param0
 * @returns Promise
 * @author Decode the refresh token
 * @author Get existing session
 * @author Make sure the session is still valid
 */
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  const session = await Session.findById(get(decoded, "_id"));

  if (!session || !session?.valid) return false;

  const user = await findOneUser({ _id: session.user, active: true });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

export const updateSession = (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return Session.updateOne(query, update);
};

export const findSessions = (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean();
};
