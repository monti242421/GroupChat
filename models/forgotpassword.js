const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const ForgotPassword = sequelize.define('forgotpasswordrequests',{
    id:{
        type : Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    isactive:{
        type: Sequelize.BOOLEAN,
    }
   

})

module.exports=ForgotPassword;