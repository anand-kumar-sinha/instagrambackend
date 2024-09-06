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
} = require("../controller/UserController");
const { protect } = require("../middleware/Auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, myProfile);
router.route("/edit-profile").post(protect, editProfile);
router.route("/search/:key").get(searchUser);
router.route("/createpost").post(protect, createPost);
router.route('/findposts/:id').get(findAllPostsById)
router.route("/post?:page").get(findAllPosts);
router.route("/add-status").post(protect, addStatus);

module.exports = router;
