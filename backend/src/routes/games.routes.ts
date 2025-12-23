import { Router } from 'express';
import { listGames, createGame } from '../controllers/games.controller';

const router = Router();

// Rota GET: http://localhost:3000/games
router.get('/', listGames);

// Rota POST: http://localhost:3000/games
router.post('/', createGame);

export default router;