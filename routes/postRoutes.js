import { Router } from "express";
import {
  getPosts, getPost, createPost, updatePost, deletePost, toggleLike,
} from "../controllers/postController.js";
import validate from "../middleware/validate.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { postSchema } from "../validation/schemas.js";

const router = Router();

// Javne rute (gost može da čita)
router.get("/", getPosts);
router.get("/:id", getPost);

// Zaštićene rute (samo prijavljeni korisnik)
router.post("/", protect, validate(postSchema), createPost);
router.put("/:id", protect, updatePost);
router.post("/:id/like", protect, toggleLike);

// Admin ruta
router.delete("/:id", protect, adminOnly, deletePost);

export default router;
