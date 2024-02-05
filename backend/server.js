require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const multer = require("multer")
const userRoutes = require('./routes/user.js')
const fileRoutes = require("./routes/file.js")


// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors())

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)
app.use("/fileUpload", upload.array("file"), fileRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })