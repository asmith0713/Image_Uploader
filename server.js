require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const File = require("./models/File");
const ngrok = require("ngrok");

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
let uploadPath = ""; // Define a variable to store the upload path

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!uploadPath) {
      const currentTime = new Date().toISOString().replace(/[:.]/g, "-");
      uploadPath = `uploads/${currentTime}`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose.connect(process.env.DATABASE_URL);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.array("files"), async (req, res) => {
  const filesData = req.files.map((file) => ({
    path: file.path,
    originalName: file.originalname,
  }));

  if (req.body.password != null && req.body.password !== "") {
    for (const fileData of filesData) {
      fileData.password = await bcrypt.hash(req.body.password, 10);
    }
  }

  const files = await File.create(filesData);

  // Reset uploadPath for the next upload session
  uploadPath = "";

  res.render("thank");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
