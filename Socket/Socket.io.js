import { Server } from "socket.io";
import express from "express";
import http from "http";
import cron from "node-cron";
import Redis from "ioredis";
import { TimeTrackingofUser } from "../Controllers/TimeCounterData.controllers.js";
import dotenv from "dotenv"; 
const app = express();
const server = http.createServer(app);

dotenv.config();

// ✅ Use Redis credentials from .env
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const io = new Server(server, {
  cors: {
    origin: ["https://frontend.conferencemeet.online/"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Step 1: Store user email when they send time data
  socket.on("timeSheet", async (data) => {
    if (data && data.length !== 0) {
      for (const user of data) {
        if (user.email) {
          // Step 2: Attach email to socket object
          socket.userEmail = user.email;

          // Store user data in Redis
          await redis.set(`time_tracking:${user.email}`, JSON.stringify(user));
        }
      }
    }
  });

  // Step 3: Identify the specific user when they disconnect
  socket.on("disconnect", async () => {
    console.log(`Client disconnected: ${socket.id}`);

    if (socket.userEmail) {
      console.log(`User disconnected: ${socket.userEmail}`);

      try {
        const userData = await redis.get(`time_tracking:${socket.userEmail}`);
        if (userData) {
          const parsedData = JSON.parse(userData);
          
          // Save only the disconnected user's data to MongoDB
          await TimeTrackingofUser([parsedData]);

          // Remove data after saving
          await redis.del(`time_tracking:${socket.userEmail}`);
          console.log(`Saved and removed data for ${socket.userEmail}`);
        }
      } catch (error) {
        console.error("Error saving disconnected user's data:", error);
      }
    }
  });
});

// ✅ Emit Redis data to admin every 5 seconds
setInterval(async () => {
  try {
    const keys = await redis.keys("time_tracking:*");
    const timeData = [];
    for (const key of keys) {
      const userData = await redis.get(key);
      if (userData) timeData.push(JSON.parse(userData));
    }
    io.emit("adminTimeUpdate", timeData);
  } catch (error) {
    console.error("Error retrieving data from Redis:", error);
  }
}, 5000);

// ✅ Save Redis data to MongoDB at 8 PM daily
cron.schedule("0 20 * * *", async () => {
  try {
    const keys = await redis.keys("time_tracking:*");
    const timeData = [];
    for (const key of keys) {
      const userData = await redis.get(key);
      if (userData) timeData.push(JSON.parse(userData));
    }
    if (timeData.length > 0) {
      await TimeTrackingofUser(timeData);
      console.log("Data saved to MongoDB successfully");
    }
  } catch (error) {
    console.error("Error saving Redis data to MongoDB:", error);
  }
});

// ✅ Clear Redis data at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const keys = await redis.keys("time_tracking:*");
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log("Old Redis data cleared at midnight");
    }
  } catch (error) {
    console.error("Error clearing Redis data:", error);
  }
});

export { server, app };
