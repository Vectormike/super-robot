import Joi from 'joi';

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const addCommentToPost = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),
};

export default { createPost, addCommentToPost };
