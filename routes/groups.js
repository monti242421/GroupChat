const express = require("express");
const router = express.Router();
const groupcontroller = require('../controller/groupcontroller');
const userautherization = require('../middleware/auth');


router.get('/groups/getgroups',userautherization.authenticate,groupcontroller.getGroups)

router.post('/groups/addgroup',userautherization.authenticate,groupcontroller.addGroup)
router.post('/groups/groupinvite',userautherization.authenticate,groupcontroller.inviteUser)
router.post('/groups/getchats',userautherization.authenticate,groupcontroller.getChat)


module.exports = router;