const Report = require("../models/reportModel")


const saveReport = async (req, res) => {
  const { user_id, report } = req.body;

  try {
    const promises = report.map(async (reportItem) => {
      const { file, matchingFiles } = reportItem;

      // Map the matchingFiles array to the desired structure
      const formattedMatchingFiles = matchingFiles.map(({ content, file, similarity }) => ({
        content,
        file,
        similarity,
      }));

      // Create a new Report document with the updated structure
      const newReport = await Report.create({
        content: reportItem.content, // If content is available in reportItem
        file,
        matchingFiles: formattedMatchingFiles,
        user_id,
      });

      return newReport;
    });

    // Wait for all documents to be created
    const createdReports = await Promise.all(promises);

    res.status(200).json({ message: "Report Saved Successfully", createdReports });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).send("Internal server error");
  }
};

// const saveReport = async (req, res) => {
//   const { user_id, report } = req.body

//   try {
//     await Promise.all(
//       report.map(async (reportItem) => {
//         const { file, matchingFiles } = reportItem
//         const newReport = await Report.create({
//           file,
//           matchingFiles,
//           user_id,
//         })
//         return newReport
//       })
//     )
//     res.status(200).json({ message: "Report Saved Successfully" })
//   } catch (error) {
//     console.error("Error saving report:", error)
//     res.status(500).send("Internal server error")
//   }
// }

const getAllReports = async (req, res) => {
  const { user_id } = req.query

  try {
    const reports = await Report.find({ user_id })

    if (reports.length > 0) {
      res.status(200).json(reports)
    } else {
      console.error(`Reports for user with ID ${user_id} not found`)
      res.status(404).send("Reports not found for the user")
    }
  } catch (error) {
    console.error("Error retrieving reports:", error)
    res.status(500).send("Internal server error")
  }
}

module.exports = { saveReport, getAllReports }
