const express = require("express");
const router = express.Router();
const chatcontroller = require('../controller/chatcontroller');
const userautherization = require('../middleware/auth');


router.post('/chats/addchat',userautherization.authenticate,chatcontroller.addChat)
router.get('/chats/getchat',userautherization.authenticate,chatcontroller.getChat)


module.exports = router;