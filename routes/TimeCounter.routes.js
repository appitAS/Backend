import express from "express";
import { tester } from "../Controllers/TimeCounterData.controllers.js";


const router = express.Router();
router.post("/tester", tester);

export default router;