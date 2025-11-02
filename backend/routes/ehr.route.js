import express from 'express';

import { createEhr, getAllEHR, getEhrByMedID, updateEhrByMedID } from '../controllers/ehr.controller.js';

const router = express.Router();

router.post('/createehr', createEhr);
router.post('/getehr',getEhrByMedID);
router.post('/updateehr',updateEhrByMedID);
router.post('/getallEHR',getAllEHR);

export default router;