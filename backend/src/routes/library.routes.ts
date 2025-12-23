import { Router } from 'express';
import { getLibrary, addGameToLibrary, updateGameStatus } from '../controllers/library.controller';

const router = Router();

// GET /library -> Lista os jogos do usuário
router.get('/', getLibrary);

// POST /library -> Adiciona um jogo (JSON: { "gameId": 1, "status": "PLAYING" })
router.post('/', addGameToLibrary);

// PATCH /library/:id -> Atualiza status/horas (O :id é o ID do registro na biblioteca)
router.patch('/:id', updateGameStatus);

export default router;