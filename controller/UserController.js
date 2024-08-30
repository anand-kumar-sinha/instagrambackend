const User = require("../models/User");
const generateToken = require("../middleware/generateToken");
const { model } = require("mongoose");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      res.status(401).json({
        success: false,
        message: "Please enter all details",
      });

      return;
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail || existingUsername) {
      res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });

      return;
    }

    const user = await User.create({ name, email, username, password });

    if (!user) {
      res.status(500).json({
        success: false,
        message: "Failed to register user",
      });

      return;
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token: generateToken(user._id),
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).json({
        success: false,
        message: "Please enter all details",
      });
      return;
    }

    const user = await User.findOne({ username }).select("+password");

    if(!user){
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if(user?.password !== password){
      res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: generateToken(user._id),
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
