const express = require("express");
const {
  registerUser,
  loginUser,
  myProfile,
  editProfile,
  searchUser,
  createPost,
  findAllPosts,
  findAllPostsById,
  addStatus,
  findAllStatus,
  likeAndUnlike,
  followUser,
} = require("../controller/UserController");
const { protect } = require("../middleware/Auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, myProfile);
router.route("/edit-profile").post(protect, editProfile);
router.route("/search/:key").get(searchUser);
router.route("/createpost").post(protect, createPost);
router.route("/findposts/:id").get(findAllPostsById);
router.route("/post?:page").get(findAllPosts);
router.route("/add-status").post(protect, addStatus);
router.route("/status?:page").get(findAllStatus);
router.route("/like-unlike/:id").get(protect, likeAndUnlike);
router.route("/follow/:id").get(protect, followUser);

module.exports = router;
