import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import cloudinary from "../utils/cloudinary.js";


/* REGISTER USER */
export const register = async ({
  firstName,
  lastName,
  email,
  password,
  picturePath,
  linkedin,
  twitter,
  friends,
  location,
  occupation,
}) => {
  try {
    // const {
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    //   picturePath,
    //   friends,
    //   location,
    //   occupation,
    // } = argument;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(`This is the picture path from the register function: ${picturePath}`);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      linkedin,
      twitter,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    return savedUser
  } catch (err) {
    throw new Error(err.message);
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
