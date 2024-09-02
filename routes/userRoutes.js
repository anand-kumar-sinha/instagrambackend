const express = require("express");
const {registerUser, loginUser, myProfile, editProfile, searchUser} = require("../controller/UserController")
const {protect} = require('../middleware/Auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, myProfile)
router.route('/edit-profile').post(protect, editProfile)
router.route('/search/:key').get(searchUser)


module.exports = router
