const {Joi, celebrate} = require('celebrate');
const validator = require('validator');

module.exports.validateCardBody = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
  
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    }),
  });


  module.exports.validateUserInfo = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30)
        .messages({
          "string.min": 'The minimun length of the "name" field is 2',
          "string.max": 'The maximum length of the "name" field is 30',
          "string.empty": 'The "name" field cannot be empty',
        }),
      avatar: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "avatar" field cannot be empty',
        "string.uri": 'The "avatar" field must be a valid URL',
      }),
      email: Joi.string().required().email().messages({
        "string.empty": 'The "email" field cannot be empty',
        "string.email": 'The "email" field must be a valid email',
      }),
      password: Joi.string().required().messages({
        "string.empty": 'The "password" field cannot be empty',
      }),
    }),
  });

  module.exports.validateLogin = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        "string.empty": 'The "email" field cannot be empty',
        "string.email": 'The "email" field must be a valid email',
      }),
      password: Joi.string().required().messages({
        "string.empty": 'The "password" field cannot be empty',
      }),
    }),
  });

  module.exports.validateIds = celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  });

  const validateURL = (value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.error('string.uri');
  }