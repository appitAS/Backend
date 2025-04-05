import express from "express";
import { tester, TimeTrackingofUser } from "../Controllers/TimeCounterData.controllers.js";


const router = express.Router();
router.post("/tester", tester);

export default router;