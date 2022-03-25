import {Router} from 'express';

import {authController} from '../controller';
import {authMiddleware} from '../middlewares';

const router = Router();

router.post('/registration', authController.registration);
router.post('/logout', authMiddleware.checkAccessToken, authController.logout);

export const authRouter = router;