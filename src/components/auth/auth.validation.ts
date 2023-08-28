import Joi from 'joi';
import { password } from '../../helpers/validation';

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password).required(),
  }),
};

export default { login };
