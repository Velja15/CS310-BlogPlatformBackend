import { Router } from "express";
import {
  getPosts, getPost, createPost, updatePost, deletePost, toggleLike,
} from "../controllers/postController.js";
import validate from "../middleware/validate.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { postSchema } from "../validation/schemas.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", protect, validate(postSchema), createPost);
router.put("/:id", protect, updatePost);
router.post("/:id/like", protect, toggleLike);

router.delete("/:id", protect, adminOnly, deletePost);

export default router;
