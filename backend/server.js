import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Ehrrroutes from './routes/ehr.route.js';
import Appointmentroutes from './routes/appointment.route.js';
import PatientSignroutes from './routes/patientSign.route.js';
import DoctorSignroutes from './routes/doctorSign.route.js';
import Prescriptionroutes from './routes/prescription.route.js';
import OwnerLabroutes from './routes/ownerLabTest.route.js';
import LabTestroutes from './routes/LabTestRoutes.js';


import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/ehr',Ehrrroutes);
app.use('/appointment',Appointmentroutes);
app.use('/patient',PatientSignroutes);
app.use('/doctor',DoctorSignroutes);
app.use('/prescription',Prescriptionroutes);
app.use('/owner',OwnerLabroutes);
app.use('/lab',LabTestroutes);



app.listen(PORT, (req,res) => {
    connectDB();
    console.log('Server is running on port 5000');
})
