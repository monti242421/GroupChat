const { where } = require('sequelize');
const chats = require('../models/chats')
const Sequelize = require('sequelize');
const groups = require('../models/groups')


exports.addChat= async (req,res,next)=>{

        try{
        const group = await groups.findAll({where:{name:req.body.groupname}})
        var groupId=null;
        if(group.length>0){
            groupId=group[0].dataValues.id;
        }   
        const chat = await chats.create({
            text:req.body.chatmessage,
            userId:req.user.dataValues.id,
            groupId:groupId
           
        })
        res.status(201).json({newchat:chat.dataValues});

        }
        catch(err)
        {
            console.log(err)
            res.status(500).json(err);
        }
        
        
    }

    exports.getChat= async (req,res,next)=>{

        try{
            var result = await chats.findAll(
                { 
                    limit: 10 ,
                    order: [[Sequelize.col('id'),'DESC']]
                }
            );
            res.json({
                result
            })
        }catch(err){
            console.log(err);
        }
                
    }