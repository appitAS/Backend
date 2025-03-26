import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique in the collection
    }
}, { timestamps: true }); 

export default mongoose.model("RegisterModel", RegisterSchema);
