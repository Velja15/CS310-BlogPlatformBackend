// Middleware koji validira req.body prema prosleđenoj JOI šemi.
// Ako podaci nisu ispravni, vraća 400 sa listom grešaka.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ message: "Validacija nije uspela", errors });
  }

  req.body = value;
  next();
};

export default validate;
