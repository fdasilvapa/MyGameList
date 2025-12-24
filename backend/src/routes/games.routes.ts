import { Router } from "express";
import { GamesController } from "../controllers/games.controller";
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get("/", GamesController.list);

router.post("/", authMiddleware, GamesController.create);

export default router;
