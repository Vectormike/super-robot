import { Router } from 'express';
import {
  createUserController,
  retrieveUsersController,
} from './user.controller';
import validate from '../../middlewares/validate';
import userValidation from './user.validation';

const router = Router();

router.post('/', validate(userValidation.createUser), createUserController);

router.get('/', retrieveUsersController);

export default router;
