import mongoose from "mongoose";

const patientSignSchema = mongoose.Schema({
    medID : {
        type: String,   
        required: true,
    },
    fname : {
        type: String,
        required: true,
    },
    lname :{
        type : String,
        required: true,
    },
    phNo : {
        type : Number,
        required: true,
    },
    DOB : {
        type : Date,
        required: true,
    },
    bloodType : {
        type : String,
        required:true,
    },
    email :{
        type : String,
        required: true,
    },
    password : {
        type : String,
        required: true,
    }
})

const PatientSign = mongoose.model('PatientSign', patientSignSchema);
export default PatientSign;