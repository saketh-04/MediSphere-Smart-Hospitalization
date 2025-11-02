import express from 'express'
import { createNewTest, deleteTest, getAll } from '../controllers/ownerLabTest.controller.js';

const router = express.Router();

router.post("/create",createNewTest);
router.post("/delete",deleteTest);
router.post("/getall",getAll);
export default router;