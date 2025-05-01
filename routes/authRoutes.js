import express from "express";
import { registerAdmin,register, login } from "../Controllers/Auth.controllers.js";
import { createUser, userLogin } from "../Controllers/Auth.v1.controller.js";

const router = express.Router();
router.post("/registeradmin", registerAdmin);
router.post("/register", register);
router.post("/login", login);
router.post("/v1/users", createUser);
router.post("/v1/login", userLogin);

export default router;