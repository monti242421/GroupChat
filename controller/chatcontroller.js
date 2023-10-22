const { where } = require('sequelize');
const chats = require('../models/chats')
const Sequelize = require('sequelize');


exports.addChat= async (req,res,next)=>{

        try{
        const chat = await chats.create({
            text:req.body.chatmessage,
            userId:req.user.dataValues.id
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