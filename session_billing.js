const fs = require("fs");
let _ = require("lodash");

// Function to parse the log file and generate the report
function generateReport(filePath) {
  // Read the log file
  const data = fs.readFileSync(filePath, "utf8");

  // Initialize variables to store session data
  const sessions = {};
  let earliestTime = "23:59:59";
  let latestTime = "00:00:00";

  // Split the data into lines
  const lines = data.split("\n");

  // Process each line
  lines.forEach((line) => {
    // Extract timestamp, username, and action
    const [timeStamp, username, action] = line.trim().split(/\s+/);
    // Validate timestamp, username, and action
    if (timeStamp && username && (action === "Start" || action === "End")) {
      // Update earliest and latest time
      if (timeStamp < earliestTime) earliestTime = timeStamp;
      if (timeStamp > latestTime) latestTime = timeStamp;

      // Update session data
      if (!sessions[`${username}_${action}`]) {
        sessions[`${username}_${action}`] = [];
      }
      sessions[`${username}_${action}`].push({ timeStamp });
    }
  });
  console.log(sessions);
  return false;

  // Process sessions and calculate total duration
  const report = [];
  for (const username in sessions) {
    const userSessions = sessions[username];

    let sessionCount = 0;
    let totalDuration = 0;
    // let activeSessions = 0;

    // Sort sessions by timestamp
    userSessions.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
    console.log(_.chunk(userSessions, 2));
    // Iterate through sorted sessions
    // userSessions.forEach((session) => {
    // if (session.action === "Start") {
    //   activeSessions++;
    // } else if (session.action === "End") {
    //   activeSessions--;
    // }
    // // If all sessions have ended or no sessions have started yet
    // if (activeSessions <= 0 || activeSessions === userSessions.length) {
    //   totalDuration += timeDifference(earliestTime, latestTime);
    // } else {
    //   totalDuration += timeDifference(
    //     session.timeStamp,
    //     userSessions[userSessions.length - 1].timeStamp
    //   );
    // }
    // sessionCount++;
    // });

    report.push({ username, sessionCount, totalDuration });
  }

  // Print the report
  report.forEach(({ username, sessionCount, totalDuration }) => {
    console.log(`${username}  ${sessionCount} ${totalDuration}`);
  });
}

// Function to calculate time difference in seconds
function timeDifference(startTime, endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return Math.floor((end - start) / 1000);
}

// Main function to run the script
function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Please provide the path of the data file.");
    return;
  }

  generateReport(filePath);
}

// Run the main function
main();

module.exports = { generateReport, timeDifference };
