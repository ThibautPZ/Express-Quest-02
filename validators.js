const { body, validationResult } = require("express-validator");

const validateMovie = [
  body("title").isLength({ max: 255 }).not().isEmpty(),
  body("director").isLength({ max: 255 }).not().isEmpty(),
  body("year").isLength({ min: 4, max: 4 }).not().isEmpty(),
  body("color").isLength({ max: 255 }).not().isEmpty(),
  body("duration").isInt().not().isEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

const Joi = require("joi");

const userSchema = Joi.object({
  firstname: Joi.string().max(255).required(),
  lastname: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  city: Joi.string().max(255).required(),
  language: Joi.string().max(255).required(),
});

const validateUser = (req, res, next) => {
  const { firstname, lastname, email, city, language } = req.body;

  const { error } = userSchema.validate(
    { firstname, lastname, email, city, language },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};
module.exports = {
  validateMovie,
  validateUser,
};
// const validateMovie = (req, res, next) => {
//   const { title, director, year, color, duration } = req.body;
//   const errors = [];

//   if (title == null) {
//     errors.push({ field: "title", message: "The field 'title' is required." });
//   } else if (title.length >= 255) {
//     errors.push({ field: "title", message: "The field 'title' is too long" });
//   }
//   if (director == null) {
//     errors.push({
//       field: "director",
//       message: "The field 'director' is required.",
//     });
//   }
//   if (year == null) {
//     errors.push({ field: "year", message: "The field 'year' is required." });
//   }
//   if (color == null) {
//     errors.push({ field: "color", message: "The field 'color' is required." });
//   }
//   if (duration == null) {
//     errors.push({
//       field: "duration",
//       message: "The field 'duration' is required.",
//     });
//   }

//   if (errors.length === 0) {
//     next();
//   } else {
//     res.status(422).json({ validationErrors: errors });
//   }
// };
