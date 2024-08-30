const express = require("express");
const {registerUser, loginUser} = require("../controller/UserController")

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').get(loginUser)


module.exports = router