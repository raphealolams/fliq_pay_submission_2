import express from 'express';
import {login, register, logout, getLoggedInSession, me } from '../controllers/user.controller';
import validate from '../middleware/validator';
import { requiresUser } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
} from "../schema/users.schema";

const router = express.Router()


router.post('/v1/users/auth', validate(loginSchema), login);
router.post('/v1/users', validate(registerSchema), register)
router.get('/v1/users/me', requiresUser, me);
router.get("/v1/users/sessions", requiresUser, getLoggedInSession);
router.delete("/v1/users/sessions", requiresUser, logout);

export { router as usersRoutes};