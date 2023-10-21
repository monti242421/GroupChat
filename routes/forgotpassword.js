const express = require("express");
const router = express.Router();
const forgotpasswordcontroller = require('../controller/forgotpasswordcontroller');


router.post('/password/forgotpassword',forgotpasswordcontroller.forgotpassword)
router.get('/password/resetpassword/:resetid',forgotpasswordcontroller.resetpassword)
router.get('/password/updatepassword/:updateid',forgotpasswordcontroller.updatepassword)

module.exports = router;