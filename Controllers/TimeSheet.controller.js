// import TimeTrackingModal from "../Models/TimeCounter.model.js";
// import moment from "moment";


// // Helper function to format time (ms -> HH:MM:SS)
// function formatTime(ms) {
//   let hours = Math.floor(ms / (1000 * 60 * 60));
//   let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
//   let seconds = Math.floor((ms % (1000 * 60)) / 1000);
//   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
// }

// export const getTimesheet = async (req, res) => {
//   try {
//     const { name, email, date, month, year } = req.body;
//     console.log(req.body)
//     let query = {};

//     if (date) {
//       const formattedDate = moment(date, ["DD-MM-YYYY", "YYYY-MM-DD", "MM/DD/YYYY"], true).format("DD-MM-YYYY");
//       query.date = formattedDate;
//     }

//     if (month && year) {
//       const monthNames = {
//         Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
//         Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
//       };

//       const monthNumber = monthNames[month];

//       if (!monthNumber) {
//         return res.status(400).json({ status: "failure", message: "Invalid month format. Use 'Jan', 'Feb', etc." });
//       }

//       const start = moment(`01-${monthNumber}-${year}`, "DD-MM-YYYY").startOf("month");
//       const end = moment(start).endOf("month");

//       query.$expr = {
//         $and: [
//           { $gte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, start.toDate()] },
//           { $lte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, end.toDate()] },
//         ],
//       };
//     }

//     if (name || email) {
//       query.$or = [];
//       if (name) query.$or.push({ name });
//       if (email) query.$or.push({ email });
//     }

//     console.log("MongoDB Query:", JSON.stringify(query, null, 2));

//     const data = await TimeTrackingModal.find(query);

//     if (data.length === 0) {
//       return res.status(404).json({
//         status: "failure",
//         message: "No records found for the given filters",
//         filtersUsed: { name, email, date, month, year },
//       });
//     }

//     // **Processing Attendance Data**
//     const totalDaysInMonth = moment(`${year}-${monthNames[month]}-01`, "YYYY-MM-DD").daysInMonth();
//     let presentDays = new Set();
//     let totalWorkTime = 0; // Total work time in milliseconds

//     data.forEach((entry) => {
//       presentDays.add(entry.date); // Assuming date is stored in 'DD-MM-YYYY' format
//       totalWorkTime += entry.workDuration || 0; // Assuming workDuration is in milliseconds
//     });

//     const allDays = Array.from({ length: totalDaysInMonth }, (_, i) =>
//       moment(`${year}-${monthNames[month]}-${i + 1}`, "YYYY-MM-DD").format("DD-MM-YYYY")
//     );

//     const absentDays = allDays.filter(day => !presentDays.has(day));

//     res.status(200).json({
//       status: "success",
//       totalPresent: presentDays.size,
//       totalAbsent: absentDays.length,
//       totalWorkTime: formatTime(totalWorkTime),
//       presentDays: [...presentDays],
//       absentDays,
//       data,
//     });
//   } catch (error) {
//     res.status(500).json({ status: "failure", message: error.message });
//   }
// };
