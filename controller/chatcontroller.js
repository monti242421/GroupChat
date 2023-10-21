const { where } = require('sequelize');
const chats = require('../models/chats')



exports.addChat= async (req,res,next)=>{

        try{
        await chats.create({
            text:req.body.chatmessage,
            userId:req.user.dataValues.id
        })
        res.status(201).json({message:'success'});

        }
        catch(err)
        {
            console.log(err)
            res.status(500).json(err);
        }
        
        
    }
