import TimeTrackingModal from "../Models/TimeCounter.model.js";
import RegisterModel from "../Models/Register.model.js";

// Time tracking function for users
export const TimeTrackingofUser = async (data) => {
  try {
    // Ensure data is an array and has at least one entry
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid data format. Expected a non-empty array.");
    }

    let results = [];

    for (let user of data) {
      let {
        name,
        email,
        date,
        WorkTime,
        BreakTime,
        idleMsg,
        totalIdleTime,
        loginAt,
        logOutAt,
      } = user;


      // Validate required fields
      if (!email || !date || WorkTime === undefined || !Array.isArray(loginAt)) {
        throw new Error(`Missing or invalid fields for user: ${email || "unknown"}`);
      }

      // Set default values if undefined or empty
      WorkTime = WorkTime ?? 0;
      BreakTime = BreakTime ?? 0;
      totalIdleTime = totalIdleTime ?? 0;
      idleMsg = Array.isArray(idleMsg) ? idleMsg : [];
      loginAt = Array.isArray(loginAt) ? loginAt : [];
      logOutAt = Array.isArray(logOutAt) ? logOutAt : [];

      // Check if the user exists
      const existingUser = await RegisterModel.findOne({ email });

      if (!existingUser) {
        throw new Error(`User ${email} does not exist.`);
      }

      // Check if an entry for the same email and date exists
      const existingEntry = await TimeTrackingModal.findOne({ email, date });

      if (existingEntry) {
        // Remove duplicate loginAt values
        const uniqueLoginAt = loginAt.filter((time) => !existingEntry.loginAt.includes(time));

        if (uniqueLoginAt.length === 0) {
          console.log(`No new login times detected for ${email}. Work time already updated.`);
          results.push(existingEntry);
          continue; // Move to next user
        }

        // Update only if values change
        const updatedEntry = await TimeTrackingModal.findOneAndUpdate(
          { email, date },
          {
            $set: { name, WorkTime, BreakTime, totalIdleTime }, 
            $push: {
              idleMsg: { $each: idleMsg },
              loginAt: { $each: uniqueLoginAt }, // Only unique login times
              logOutAt: { $each: logOutAt },
            },
          },
          { new: true }
        );

        results.push(updatedEntry);
      } else {
        // Create a new entry if none exists
        const newUser = new TimeTrackingModal({
          name,
          email,
          date,
          WorkTime,
          BreakTime,
          idleMsg,
          totalIdleTime,
          loginAt,
          logOutAt,
        });


        const savedUser = await newUser.save();
        results.push(savedUser);
      }
    }

    return results; // ✅ Return all processed user data

  } catch (err) {
    console.error("Error Saving Work Time:", err);
    throw new Error(`Your Work Time was not saved. Error: ${err.message}`);
  }
};


