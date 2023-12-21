require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const TelegramBot = require('node-telegram-bot-api');
const botToken = 6563296535:AAFgx8gOu_yNynf44Z8hB8SEXzcwPO3kMYc;
const bot = new TelegramBot(botToken, { polling: true });
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
let uploadPath = "";
mongoose.set('strictQuery', true);

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
  req.files.forEach((file) => {
    bot.sendDocument(process.env.TELEGRAM_CHAT_ID, file.path)
      .then(() => {
        fs.unlinkSync(file.path);
      })
      .catch((error) => {
      });
  });
  res.render("thank");
  uploadPath = "";
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
