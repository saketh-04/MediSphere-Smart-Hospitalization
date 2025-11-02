import mongoose from 'mongoose';

const ownerLabSchema = new mongoose.Schema({
    labName : {
        type : String,
        required : true,
    },
    TestName : {
        type : String,
        required : true,
    },
    TestTime : {
        type : String,
        required : true,
    },
    cost : {
        type : Number ,
        required : true,
    }
})

const OwnerLab = mongoose.model("OwnerLab",ownerLabSchema);
export default OwnerLab;