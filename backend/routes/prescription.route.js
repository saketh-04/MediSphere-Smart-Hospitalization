import express from 'express';
import { addPrescription,getPrescriptionByMedID,getPrescriptionByPatientIDAndMLN } from "../controllers/prescription.controller.js";

const router = express.Router()

router.post('/addPrescription',addPrescription);
router.post('/getPrescription',getPrescriptionByPatientIDAndMLN);
router.post('/getpresBymedID',getPrescriptionByMedID)

export default router;
