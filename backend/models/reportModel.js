const mongoose = require("mongoose")

const Schema = mongoose.Schema


const reportSchema = new Schema({
  content: String,
  file: String,
  matchingFiles: [
    {
      content: String,
      file: String,
      similarity: String,
    },
  ],
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema)
