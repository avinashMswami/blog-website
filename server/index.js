import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import {v2 as cloudinary} from "cloudinary";
// import { log } from "console";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});


/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), async (req,res)=>
{
  try{
  const response = await cloudinary.uploader.upload(req.file.path);
  // console.log(response);
  const {url} = response;
  const picturePath = url;

  const {
    firstName,
    lastName,
    email,
    password,
    friends,
    linkedin,
    twitter,
    location,
    occupation,
  } = req.body;
  // console.log(`Picture pth is: ${picturePath}`);
  // const argument = {picturePath:picturePath, ...req.body};
  const savedUser = await register( {
    firstName,
    lastName,
    email,
    password,
    picturePath: picturePath,
    linkedin,
    twitter,
    friends,
    location,
    occupation,
  });
  console.log(savedUser);
  res.status(201).json(savedUser);} catch(error){
    res.status(500).json({error: error.message});
  }

});
app.post("/posts", verifyToken, upload.single("picture"), async(req,res)=>{
  try{
    let picturePath="";
    if(req.file){
  const response = await cloudinary.uploader.upload(req.file.path);
  const {url} = response;
  picturePath = url;}

  const {description, userId} = req.body;
  const newPost = await createPost({userId, description,picturePath:picturePath});
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
}});

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
