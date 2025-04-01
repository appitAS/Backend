import express from "express";
import { getTimesheet } from "../Controllers/TimeSheet.controller.js";
const router = express.Router();

router.post("/employeeTimesheet", getTimesheet);

export default router;
