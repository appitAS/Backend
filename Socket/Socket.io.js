import { Server } from "socket.io";
import express from "express";
import http from "http";
import cron from "node-cron"; // Import node-cron
import { TimeTrackingofUser } from "../Controllers/TimeCounterData.controllers.js";

const app = express();
const server = http.createServer(app);
let TimeData = [];
let saveDataFlag = false;

const io = new Server(server, {
  cors: {
    origin: ["https://appit-time-tracker-front-end-admin-sides.vercel.app/createuser"],
    methods: ["GET", "POST"],
    credentials: true, // ✅ Needed if frontend uses withCredentials
  },
});

io.on("connection", (socket) => {
  
  // Listen for timer updates from the app
  socket.on("timeSheet", (data) => {
    if (data && data.length !== 0){
    TimeData = data;
    console.log(data)
    io.emit("gettimerUpdate", data);
    }
  });

  socket.on("disconnect", async () => {
    if (TimeData && TimeData.length !== 0) {
      try {
        await TimeTrackingofUser(TimeData);
        TimeData = []; // Clear after saving
        saveDataFlag = true;
      } catch (error) {
        console.error("Error saving time tracking data:", error);
      }
    }
  });
});

// Schedule data saving every day at 8 PM
// cron.schedule("0 20 * * *", async () => {
//   if (TimeData.length !== 0) {
//     try {
//       await TimeTrackingofUser(TimeData);
//       console.log("✅ Data saved at 8 PM");
//     } catch (error) {
//       console.error("❌ Error in scheduled data saving:", error);
//     }
//   }
// });

setInterval(async () => {  // ✅ Use async function
  if (TimeData.length !== 0) {
    try {
      await TimeTrackingofUser(TimeData);
      console.log("✅ Data saved every 30 minutes");
      TimeData = []; // ✅ Clear data after saving
    } catch (error) {
      console.error("❌ Error in scheduled data saving:", error);
    }
  }
}, 30 * 60 * 1000); // ✅ 30 minutes (1800000 milliseconds)

export { server ,app };
