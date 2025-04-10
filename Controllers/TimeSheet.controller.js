import TimeTrackingModal from "../Models/TimeCounter.model.js";
import moment from "moment";

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export const getTimesheet = async (req, res) => {
  try {
    const { name, email, date, month, year } = req.body;
    let query = {};

    const monthNames = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };

    if (date) {
      const formattedDate = moment(date, ["DD-MM-YYYY", "YYYY-MM-DD", "MM/DD/YYYY"], true).format("DD-MM-YYYY");
      query.date = formattedDate;
    }

    if (month && year) {
      const monthNumber = monthNames[month];
      if (!monthNumber) {
        return res.status(400).json({ status: "failure", message: "Invalid month format. Use 'Jan', 'Feb', etc." });
      }

      const start = moment(`01-${monthNumber}-${year}`, "DD-MM-YYYY").startOf("month");
      const end = moment(start).endOf("month");

      query.$expr = {
        $and: [
          { $gte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, start.toDate()] },
          { $lte: [{ $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } }, end.toDate()] },
        ],
      };
    }

    if (name || email) {
      query.$or = [];
      if (name) query.$or.push({ name });
      if (email) query.$or.push({ email });
    }

    const data = await TimeTrackingModal.find(query);

    if (data.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "No records found for the given filters",
        filtersUsed: { name, email, date, month, year },
      });
    }

    let employeeRecords = {};

    data.forEach((entry) => {
      const { name, date, WorkTime } = entry;

      if (!employeeRecords[name]) {
        employeeRecords[name] = {
          presentDays: new Set(),
          totalWorkTime: 0,
        };
      }

      employeeRecords[name].presentDays.add(date); // only unique dates
      employeeRecords[name].totalWorkTime += WorkTime || 0;
    });

    const response = {};

    if (month && year) {
      const monthNumber = monthNames[month];
      const totalDaysInMonth = moment(`${year}-${monthNumber}-01`, "YYYY-MM-DD").daysInMonth();

      let allDays = Array.from({ length: totalDaysInMonth }, (_, i) =>
        moment(`${year}-${monthNumber}-${i + 1}`, "YYYY-MM-DD").format("DD-MM-YYYY")
      );

      let satSunHolidays = allDays.filter(day => {
        let dayOfWeek = moment(day, "DD-MM-YYYY").day();
        return dayOfWeek === 0 || dayOfWeek === 6;
      });

      const today = moment().startOf("day");

      response.employees = Object.keys(employeeRecords).map((emp) => {
        let absentDays = allDays.filter(day => {
          const dayMoment = moment(day, "DD-MM-YYYY").startOf("day");
          const isWeekend = dayMoment.day() === 0 || dayMoment.day() === 6;
          const isFuture = dayMoment.isAfter(today);
          const isPresent = employeeRecords[emp].presentDays.has(day);

          return !isWeekend && !isFuture && !isPresent;
        });

        let totalAbsent = absentDays.length;

        return {
          name: emp,
          totalPresent: employeeRecords[emp].presentDays.size,
          presentDays: [...employeeRecords[emp].presentDays],
          absentDays,
          totalAbsent,
          satSunHolidays,
          totalWorkTime: formatTime(employeeRecords[emp].totalWorkTime),
        };
      });
    } else {
      response.data = data;
    }

    return res.status(200).json({
      status: "success",
      ...response,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

