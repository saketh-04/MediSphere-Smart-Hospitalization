import mongoose from 'mongoose' 

const appointmentSchema = new mongoose.Schema({
    doctorID : {
        type : String ,
        required : true,
    },
    patientID : {
        type:String,
        required:true,
    },
    isemailSend :{
        type:String,
        required : true,
    },
    isComplete : {
        type: String ,
        required:true,
    },
    email : {
        type : String ,
        required: true,
    },
    appointmentID : {
        type : Number,
        required: true,
    },
    date : {
        type : Date,
        required: true  ,
    },
    time : {
        type : String,
        required: true
    },
    patientName : {
        type : String,
        required: true
    },
    phoneNO : {
        type : Number,
        required: true
    },
    reasonVisit : {
        type : String,
        required: true
    }
})

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;