import { Router } from "express";
import { getComments, createComment, deleteComment } from "../controllers/commentController.js";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import { commentSchema } from "../validation/schemas.js";

const router = Router();

router.get("/", getComments);
router.post("/", protect, validate(commentSchema), createComment);
router.delete("/:id", protect, deleteComment);

export default router;
