import mongoose from "mongoose";

const TimeTrackingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    BreakTime: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        required: true
    },
    idleMsg: {
        type: [String],
        default: [] // ✅ Ensures idleMsg is always an empty array if not provided
    },
    WorkTime: {
        type: Number,
        default: 0
    },
    totalIdleTime: {
        type: Number,
        default: 0
    },
    loginAt: {
        type: [String],
        default: [] // ✅ Ensures loginAt is always an empty array instead of 0
    },
    logOutAt: {
        type: [String],
        default: [] // ✅ Ensures loginAt is always an empty array instead of 0
    }
}, { timestamps: true });

export default mongoose.model("TimeTrackingModel", TimeTrackingSchema);
