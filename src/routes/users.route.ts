import express from 'express';
import {login, register, logout, getLoggedInSession, me, deleteUser, getUsers, getUser } from '../controllers/user.controller';
import validate from '../middleware/validator';
import { requiresAdmin, requiresUser } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  deleteUserSchema,
} from "../schema/users.schema";

const router = express.Router()


router.post('/v1/users/auth', validate(loginSchema), login);
router.post('/v1/users', validate(registerSchema), register)
router.get('/v1/users/me', requiresUser, me);
router.get("/v1/users/sessions", requiresUser, getLoggedInSession);
router.delete("/v1/users/sessions", requiresUser, logout);
router.delete("/v1/users/:userId", [requiresAdmin, validate(deleteUserSchema)], deleteUser)
router.get("/v1/users", requiresAdmin, getUsers)
router.get("/v1/users/:userId", requiresAdmin, getUser)


export { router as usersRoutes};