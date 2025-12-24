import { Router } from 'express';
import { PlatformsController } from '../controllers/platforms.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rota Pública (Listar para preencher selects no front)
router.get('/', PlatformsController.list);

// Rota Privada (Só usuário logado cria plataforma nova)
router.post('/', authMiddleware, PlatformsController.create);

export default router;
