import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Rota Pública: Ver perfil de alguém
router.get("/:username", UsersController.getProfile);

// Rota Privada: Editar MEU perfil
router.patch("/profile", authMiddleware, UsersController.updateProfile);

// Ações Sociais (Privadas)
// POST /users/123/follow
router.post('/:id/follow', authMiddleware, UsersController.followUser);

// DELETE /users/123/follow
router.delete('/:id/follow', authMiddleware, UsersController.unfollowUser);

export default router;
