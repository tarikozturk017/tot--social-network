import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/", verifyToken, getFeedPosts); // it'll show every posts
router.get("/:userId/posts", verifyToken, getUserPosts); // this route will only show user with userId's posts

// UPDATE
router.patch("/:id/like", verifyToken, likePost); // like/unlike the post

export default router;