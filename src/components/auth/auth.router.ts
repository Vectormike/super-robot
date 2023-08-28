import { Router } from 'express';
import { loginUserController } from './auth.controller';
import validate from '../../middlewares/validate';
import authValidation from './auth.validation';

const router = Router();

router.post('/login', validate(authValidation), loginUserController);

export default router;
