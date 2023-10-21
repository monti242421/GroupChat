
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

const user = require('./models/user');
const forgetpassword = require('./models/forgotpassword');

app.use(bodyParser.json({extended:false}));


user.hasMany(forgetpassword);
forgetpassword.belongsTo(user);

app.use(userRoute);
//app.use(forgotpasswordRoute);
// app.use((req,res)=>{
//     console.log(req.url);
//     res.sendFile(path.join(__dirname,`public/${req.url}`))
// })
sequelize.sync();
//sequelize.sync({force:true});
app.listen(4000);