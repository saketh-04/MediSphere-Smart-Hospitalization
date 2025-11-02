import express from "express";
import { submitLabTest, getLabTests, updateLabTest } from "../controllers/labTestController.js";

const router = express.Router();

router.post("/submit", submitLabTest);
router.get("/dashboard", getLabTests);
router.put("/update/:id", updateLabTest);

export default router;
