import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, username: user.username },
    process.env.JWT_SECRET || "tajni_kljuc_dev",
    { expiresIn: "7d" }
  );

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Ovaj email je već registrovan" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user);
    return res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ message: "Greška na serveru", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Pogrešan email ili lozinka" });
    }

    const token = generateToken(user);
    return res.json({ token, user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ message: "Greška na serveru", error: error.message });
  }
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Korisnik nije pronađen" });
  return res.json(user.toJSON());
};
