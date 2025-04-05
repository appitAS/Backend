import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { server, app } from "./Socket/Socket.io.js"; // Import WebSocket server

// Import routes
import authRoutes from "./routes/authRoutes.js";
import TimeTrackingofUser from "./routes/TimeCounter.routes.js";
import EmployeeTimeSheet from "./routes/TimeSheets.routes.js";


dotenv.config();

const mongoDBUri = process.env.MONGODB_URI;
const port = process.env.PORT || 8000;

mongoose
  .connect(mongoDBUri)
  .then(() => {
    console.log("MongoDB connected");
  })

  .catch((err) => {
    console.log("Database not connected", err);
  });

// ✅ Middleware Setup (Ensure JSON is parsed)
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/employee", TimeTrackingofUser);
app.use("/api/timeSheet", EmployeeTimeSheet);

server.listen(port, "localhost", () => {
  console.log(`Server is listening on ${port}`);
});
