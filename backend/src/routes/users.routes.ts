import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Rota Pública: Ver perfil de alguém
router.get("/:username", UsersController.getProfile);

// Rota Privada: Editar MEU perfil
router.patch("/profile", authMiddleware, UsersController.updateProfile);

export default router;
