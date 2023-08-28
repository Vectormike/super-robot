import Joi from 'joi';
import { password } from '../../helpers/validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().custom(password).required(),
  }),
};

export default { createUser };
