import express from 'express';
import { createPatientSign, checkPatientSign ,getByEmail } from '../controllers/patientSign.controller.js';

const router = express.Router();

router.post('/createPatientSign', createPatientSign);
router.post('/checkPatientSign', checkPatientSign);
router.post('/getByEmail',getByEmail);

export default router;