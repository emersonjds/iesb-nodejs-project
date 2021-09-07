const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');

const multer = require('multer');

const app = express();

//enable config with .env file
dotenv.config();

//enable json data 
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => { console.log(err) });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name)
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single("file"), (req, res) => {
  res.status(200).json('File has been uploaded')
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(3000, () => {
  console.log('backend is running');
})