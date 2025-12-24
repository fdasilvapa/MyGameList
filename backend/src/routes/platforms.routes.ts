import { Router } from 'express';
import { PlatformsController } from '../controllers/platforms.controller';

const router = Router();

router.post('/', PlatformsController.create);
router.get('/', PlatformsController.list);

export default router;
