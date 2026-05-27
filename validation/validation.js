const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: errorMessages.join(", ") });
    }
    next();
  };
};

const authSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email noto'g'ri formatda",
    "any.required": "Email kiritilishi shart",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    "any.required": "Parol kiritilishi shart",
  }),
});

const groupSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Guruh nomi kiritilishi shart",
  }),
  speciality: Joi.string().required().messages({
    "any.required": "Yo'nalish kiritilishi shart",
  }),
  teacherId: Joi.number().integer().allow(null, "").messages({
    "number.base": "O'qituvchi ID raqam bo'lishi kerak",
  }),
});

const teacherSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "any.required": "O'qituvchi ismi-sharifi kiritilishi shart",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Telefon raqami kiritilishi shart",
  }),
});

const studentSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "any.required": "O'quvchi ismi-sharifi kiritilishi shart",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Telefon raqami kiritilishi shart",
  }),
  coin: Joi.number().integer().min(0).allow(null, "").messages({
    "number.base": "Coin raqam bo'lishi kerak",
  }),
  groupId: Joi.number().integer().allow(null, "").messages({
    "number.base": "Guruh ID raqam bo'lishi kerak",
  }),
});

module.exports = {
  validate,
  authSchema,
  groupSchema,
  teacherSchema,
  studentSchema,
};
