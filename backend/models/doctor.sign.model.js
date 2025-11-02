import mongoose from 'mongoose';

const doctorSignSchema = mongoose.Schema({
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
    MLN : {
        type : String,
        required: true,
    },
    Specilzation : {
        type : String,
        required: true,
    },
    Location : {
        type : String ,
        required : true ,
    },
    Experience : {
        type: String ,
        required : true,
    },
    Qualifications : {
        type : String ,
        required : true,
    },
    workingHours : {
        type : String ,
        required : true,
    },
    About : {
        type : String ,
        required : true ,
    },
    Special : {
        type : String ,
        required : true,
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

const DoctorSign = mongoose.model('DoctorSign', doctorSignSchema);
export default DoctorSign;