const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const Admin_groups = sequelize.define('admin_groups',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

})

module.exports=Admin_groups;