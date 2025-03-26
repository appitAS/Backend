import express from "express";
import { registerAdmin,register, login } from "../Controllers/Auth.controllers.js";

const router = express.Router();
router.post("/registeradmin", registerAdmin);
router.post("/register", register);
router.post("/login", login);

export default router;