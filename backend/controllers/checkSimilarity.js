const fs = require("fs")
const {
  tokenizeCode,
  preprocessPythonCode,
  calculateTokenSimilarity,
} = require("../algorithms/algos")

const checkSimilarity = (req, res) => {
  const files = req.files
  const similarityResults = []

  // Process each uploaded file
  files.forEach((file, index) => {
    const { originalname, path } = file

    // Read the file content
    const data = fs.readFileSync(path, "utf8")
    const preprocessedCode = preprocessPythonCode(data)
    const tokens = tokenizeCode(preprocessedCode)

    // Create an array to hold matching files for the current file
    const matchingFiles = []

    // Compare the current file against other files
    const otherFiles = files.filter((_, i) => i !== index)

    otherFiles.forEach((otherFile) => {
      const { originalname: otherName, path: otherPath } = otherFile

      // Read the other file content
      const otherData = fs.readFileSync(otherPath, "utf8")
      const preprocessedOtherCode = preprocessPythonCode(otherData)
      const otherTokens = tokenizeCode(preprocessedOtherCode)

      // Calculate the similarity percentage
      const similarityPercentage = calculateTokenSimilarity(tokens, otherTokens)

      if (similarityPercentage) {
        // If there is a match, add the other file to the matchingFiles array
        const matchingWords = tokens.filter((token) =>
          otherTokens.includes(token)
        )

        matchingFiles.push({
          file: otherName,
          similarity: similarityPercentage,
          content: otherData, 
          matchingWords: matchingWords,
        })
      }
    })

    // Add the matchingFiles array to the similarityResults along with content of the current file
    similarityResults.push({
      file: originalname,
      content: data, // Add content of the current file
      matchingFiles,
    })
  })

  return res.json(similarityResults)
}

module.exports = { checkSimilarity }
