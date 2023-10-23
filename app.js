
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();

const sequelize = require('./util/database')

app.use(cors());

const userRoute = require('./routes/user');
const forgotpasswordRoute = require('./routes/forgotpassword');
const chatsRoute = require('./routes/chats');
const groupsRoute = require('./routes/groups');

const user = require('./models/user');
const forgetpassword = require('./models/forgotpassword');
const chats = require('./models/chats');
const groups = require('./models/groups');
const usergroups = require('./models/usergroups');

app.use(bodyParser.json({extended:false}));


user.hasMany(forgetpassword);
forgetpassword.belongsTo(user);

user.hasMany(chats);
chats.belongsTo(user);

groups.hasMany(chats);
chats.belongsTo(groups);

user.belongsToMany(groups,{through:usergroups});
groups.belongsToMany(user,{through:usergroups})

app.use(userRoute);
app.use(chatsRoute)
app.use(forgotpasswordRoute);
app.use(groupsRoute);
app.use((req,res)=>{
    console.log(req.url);
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})
sequelize.sync();
//sequelize.sync({force:true});
app.listen(4000);