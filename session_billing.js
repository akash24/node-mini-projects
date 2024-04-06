const fs = require("fs");
let _ = require("lodash");

// Function to parse the log file and generate the report
/*
14:02:03 ALICE99  Start
14:02:34 ALICE99  End
14:02:58 ALICE99  Start
14:03:02 CHARLIE  Start
14:03:35 ALICE99  End
14:03:37 CHARLIE  End
14:04:05 ALICE99  Start
14:04:23 ALICE99  End
14:04:55 CHARLIE  Start
14:05:03 ALICE99  End
*/
function generateReport(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const sessions = {};
  let earliestTime = "23:59:59";
  let latestTime = "00:00:00";

  const lines = data.split("\n");
  lines.forEach((line) => {
    const [timeStamp, username, action] = line.trim().split(/\s+/);
    if (timeStamp && username && (action === "Start" || action === "End")) {
      if (timeStamp < earliestTime) earliestTime = timeStamp;
      if (timeStamp > latestTime) latestTime = timeStamp;
      if (!sessions[username]) {
        sessions[username] = [];
      }
      sessions[username].push({ timeStamp, action });
    }
  });

  const report = [];
  for (const username in sessions) {
    const userSessions = sessions[username];

    let sessionCount = 0;
    let totalDuration = 0;

    // userSessions.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));

    let inSession = false;
    let sessionStart = "";
    userSessions.forEach((session) => {
      if (session.action === "Start") {
        inSession = true;
        sessionStart = session.timeStamp;
      } else if (session.action === "End" && inSession) {
        inSession = false;
        totalDuration += timeDifference(sessionStart, session.timeStamp);
        sessionCount++;
      } else if (session.action === "End" && !inSession) {
        totalDuration += timeDifference(earliestTime, session.timeStamp);
        sessionCount++;
      }
    });

    if (inSession) {
      sessionCount++;
    }

    report.push({ username, sessionCount, totalDuration });
  }

  // Print the report
  report.forEach(({ username, sessionCount, totalDuration }) => {
    console.log(`${username}  ${sessionCount} ${totalDuration}`);
  });
  return report;
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
