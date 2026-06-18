import Comment from "../models/Comment.js";

export const getComments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.postId) filter.postId = req.query.postId;
    const comments = await Comment.find(filter).sort({ createdAt: 1 });
    return res.json(comments.map((c) => c.toJSON()));
  } catch (error) {
    return res.status(500).json({ message: "Greška pri učitavanju komentara", error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const comment = await Comment.create({
      postId,
      content,
      authorId: req.user.id,
      authorName: req.user.username,
    });
    return res.status(201).json(comment.toJSON());
  } catch (error) {
    return res.status(500).json({ message: "Greška pri kreiranju komentara", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Komentar nije pronađen" });

    const isOwner = comment.authorId === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Nemate dozvolu za brisanje ovog komentara." });
    }

    await comment.deleteOne();
    return res.json({ message: "Komentar obrisan", id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: "Greška pri brisanju komentara", error: error.message });
  }
};
