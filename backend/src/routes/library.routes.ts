import { Router } from 'express';
import { LibraryController } from '../controllers/library.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', LibraryController.getLibrary);

router.post('/', LibraryController.addEntry);

router.patch('/:id', LibraryController.updateEntry);

export default router;