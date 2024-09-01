const express = require("express");
const {registerUser, loginUser, myProfile} = require("../controller/UserController")
const {protect} = require('../middleware/Auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, myProfile)


module.exports = router