import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// GET /users — lista svih korisnika (samo administrator).
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    return res.json(users.map((u) => u.toJSON()));
  } catch (error) {
    return res.status(500).json({ message: "Greška pri učitavanju korisnika", error: error.message });
  }
};

// DELETE /users/:id — brisanje korisnika (samo administrator).
// Administrator ne može obrisati sopstveni nalog.
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Ne možete obrisati sopstveni nalog." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Korisnik nije pronađen" });
    return res.json({ message: "Korisnik obrisan", id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: "Greška pri brisanju korisnika", error: error.message });
  }
};
