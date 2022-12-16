import express from "express";
import { login } from "../controllers/auth.js"

const router = express.Router(); // it allows express to identify, these routes will be configured and allow to have it in separate files

// anything in the route will be added after /auth. because in index.js authRoutes are specified
router.post("/login", login); // instead of app.use -> router.post

export default router;