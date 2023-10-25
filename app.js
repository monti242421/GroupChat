
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app); //all http request will be handled by express
const {Server}= require('socket.io');
const io = new Server(server); // all sockets request will be handled by this



const bodyParser = require('body-parser');
var cors = require('cors');

const jwt = require('jsonwebtoken');
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
const admin = require('./models/admin');
const admin_groups= require('./models/admin_groups');

app.use(bodyParser.json({extended:false}));


user.hasMany(forgetpassword);
forgetpassword.belongsTo(user);

user.hasMany(chats);
chats.belongsTo(user);

groups.hasMany(chats);
chats.belongsTo(groups);

user.belongsToMany(groups,{through:usergroups});
groups.belongsToMany(user,{through:usergroups})

admin.belongsToMany(groups,{through:admin_groups});
groups.belongsToMany(admin,{through:admin_groups});

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
//app.listen(4000);

io.on('connection',  (socket) => {
    console.log('a user connected',socket.id);
    const token = socket.handshake.auth.token;
    const user = jwt.verify(token,process.env.TOKEN_SECRET);
    //console.log(user);
    socket.on('user-message', async (message)=>{
        try{
            //console.log(message);
            const group = await groups.findOne({where:{name:message.groupname}})
            //console.log(group);
            var groupId=null;
            if(group!=null){
                groupId=group.dataValues.id;
            }   
            const chat = await chats.create({
                text:message.chatmessage,
                userId:user.userId,
                groupId:groupId
               
            })
            io.emit('message',message);
            }
            catch(err)
            {
                console.log(err)
            }
       
    })
  });


server.listen(4000);