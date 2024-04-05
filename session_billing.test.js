const fs = require("fs");
const { generateReport, timeDifference } = require("./session_billing");

// describe("generateReport", () => {
//   test("should generate correct report from log file", () => {
//     const filePath = "./test_data/test_logfile.txt";
//     const expectedReport = [
//       { username: "ALICE99", sessionCount: 4, totalDuration: 240 },
//       { username: "CHARLIE", sessionCount: 3, totalDuration: 37 },
//     ];

//     const report = generateReport(filePath);

//     expect(report).toEqual(expectedReport);
//   });
// });

describe("timeDifference", () => {
  test("should calculate correct time difference in seconds", () => {
    const startTime = "14:02:03";
    const endTime = "14:02:05";
    const expectedDifference = 2;

    const difference = timeDifference(startTime, endTime);

    expect(difference).toEqual(expectedDifference);
  });
});
