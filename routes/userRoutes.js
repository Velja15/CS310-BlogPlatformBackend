import { Router } from "express";
import { getUsers, deleteUser } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
