import { Router } from "express";
import { GamesController } from "../controllers/games.controller";

const router = Router();

router.get("/", GamesController.list);
router.post("/", GamesController.create);

export default router;
