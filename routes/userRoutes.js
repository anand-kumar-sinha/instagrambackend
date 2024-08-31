const express = require("express");
const {registerUser, loginUser} = require("../controller/UserController")

const router = express.Router()

router.route('/register').get(registerUser)
router.route('/login').post(loginUser)


module.exports = router