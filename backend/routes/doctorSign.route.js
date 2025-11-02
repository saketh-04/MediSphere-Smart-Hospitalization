import express from 'express';

import { createDoctorSign, checkDoctorSign, getByEmail ,getAll} from '../controllers/doctorSign.controller.js';

const router = express.Router();

router.post('/createDoctorSign', createDoctorSign);
router.post('/checkDoctorSign', checkDoctorSign);
router.post('/getByEmail',getByEmail);
router.post('/getAll' ,getAll);

export default router;