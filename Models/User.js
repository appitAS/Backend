import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: false
    },
    department:{
        type: String,
        required: false
    },
    lineManager:{
        type: String,
        required: false
    }
}, { timestamps: true });

export default mongoose.model("IdeUser",userSchema);
