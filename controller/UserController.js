const User = require("../models/User");
const generateToken = require("../middleware/generateToken");
const Post = require("../models/Post");

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

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user?.password !== password) {
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

const myProfile = async (req, res) => {
  try {
    let user = req?.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please Login Again",
      });

      return;
    }

    const id = req.user._id;

    user = await User.findById(id);
    const posts = await User.findById(id).populate("posts");

    res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
      user,
      posts: posts.posts.reverse(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const user = req?.user;
    const { name, taged, bio, mobile, link, gender, avatar } = req.body;
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Please Login Again",
      });
      return;
    }

    const existing = await User.findOne({ _id: user._id });
    if (!existing) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    if (name) {
      user.name = name;
    }

    if (taged) {
      user.taged = taged;
    }
    if (mobile) {
      user.mobile = mobile;
    }

    if (link) {
      user.link = link;
    }

    if (gender) {
      user.gender = gender;
    }

    if (bio) {
      user.bio = bio;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: req.params.key, $options: "i" } },
        { username: { $regex: req.params.key, $options: "i" } },
      ],
    }).populate("posts");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = {
      desc: req.body.desc,
      postUrl: req.body.postUrl,
      postType: req.body.postType,
      admin: req.user._id,
    };

    if (!newPost.postUrl) {
      return res.status(400).json({
        success: false,
        message: "Please Select Media",
      });
    }

    const user = await User.findById(req.user._id);

    const post = await Post.create(newPost);

    await user.posts.push(post._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const findAllPostsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const posts = await User.findById(id).populate("posts");

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: posts.posts.reverse(),
    });
  } catch (error) {
    console.log(error);
  }
};

const findAllPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 5;
    const pageNo = parseInt(page, 10);

    const startIndex = (pageNo - 1) * limit;

    const total = await Post.countDocuments({});

    const posts = await Post.find()
      .populate("admin")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: `Posts fetched successfully`,
      posts,
      currentPage: pageNo,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const addStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = req.user;

    if(!user){
      return res.status(401).json({
        success: false,
        message: "Please Login Again",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please Select Media",
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      user,
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
  loginUser,
  myProfile,
  editProfile,
  searchUser,
  createPost,
  findAllPostsById,
  findAllPosts,
  addStatus
};
