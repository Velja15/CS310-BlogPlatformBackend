import Joi from "joi";


export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Korisničko ime mora imati najmanje 3 karaktera",
    "any.required": "Korisničko ime je obavezno",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Unesite ispravan email",
    "any.required": "Email je obavezan",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Lozinka mora imati najmanje 6 karaktera",
    "any.required": "Lozinka je obavezna",
  }),
  confirmPassword: Joi.any().optional(),
  role: Joi.any().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Unesite ispravan email",
    "any.required": "Email je obavezan",
  }),
  password: Joi.string().required().messages({
    "any.required": "Lozinka je obavezna",
  }),
});

export const postSchema = Joi.object({
  title: Joi.string().min(5).max(150).required().messages({
    "string.min": "Naslov mora imati najmanje 5 karaktera",
    "any.required": "Naslov je obavezan",
  }),
  content: Joi.string().min(20).required().messages({
    "string.min": "Sadržaj mora imati najmanje 20 karaktera",
    "any.required": "Sadržaj je obavezan",
  }),
  category: Joi.string()
    .valid("Programiranje", "Web Dizajn", "Obrazovanje", "Tehnologija", "Ostalo")
    .required()
    .messages({
      "any.only": "Neispravna kategorija",
      "any.required": "Kategorija je obavezna",
    }),

  imageUrl: Joi.string().allow("").optional(),
  authorId: Joi.any().optional(),
  authorName: Joi.any().optional(),
  createdAt: Joi.any().optional(),
});

export const commentSchema = Joi.object({
  postId: Joi.string().required().messages({
    "any.required": "postId je obavezan",
  }),
  content: Joi.string().min(1).max(1000).required().messages({
    "string.empty": "Komentar ne sme biti prazan",
    "any.required": "Sadržaj komentara je obavezan",
  }),
  authorId: Joi.any().optional(),
  authorName: Joi.any().optional(),
  createdAt: Joi.any().optional(),
});
