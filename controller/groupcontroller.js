const { where } = require('sequelize');
const groups = require('../models/groups')
const user= require('../models/user')
const usergroups = require('../models/usergroups');
const { use } = require('../routes/user');
const chats = require('../models/chats')
const Sequelize = require('sequelize');

function isStringInvalid(string){
    if(string ==undefined || string.length===0){
        return true
    }else{
        return false
    }
}

exports.addGroup= async (req,res,next)=>{


    try{

        if(isStringInvalid(req.body.groupname)){
            return res.status(400).json({message:"Bad Parameters, Missing fields"});
        }

        const group = await groups.create({
            name:req.body.groupname,
        }
        )

        await usergroups.create({
            userId:req.user.id,
            groupId:group.dataValues.id
        })
        res.status(201).json({newgroup:group.dataValues});

        }
        catch(err)
        {
            console.log(err)
            if(err.name=='SequelizeUniqueConstraintError')
            res.status(500).json({message:'Group already exists'});
        }
        


}

exports.inviteUser = async (req,res,next)=>{
    
    try{
        if(isStringInvalid(req.body.groupname) || isStringInvalid(req.body.inviteemail)){
            return res.status(400).json({message:"Bad Parameters, Missing fields"});
        }
        const groupname = await groups.findAll({where:{name:req.body.groupname}})
        const inviteduser = await user.findAll({where:{email:req.body.inviteemail}})
        if(groupname.length>0 && inviteduser.length>0){
            await usergroups.create({
                userId:inviteduser[0].dataValues.id,
                groupId:groupname[0].dataValues.id
            })
            res.status(201).json({message:"Invited User Added"})
        }else{
            if(isStringInvalid(groupname)){
                return res.status(404).json({message:"Group doesnt exist, you can add to existing groups only"})
            }

            if(isStringInvalid(inviteduser)){
                return res.status(404).json({message:"User doesnt exist, enter correct email id"})
            }
                  
        }
    }catch(err){
        console.log(err);
    }
}

exports.getGroups = async(req,res,next)=>{
    try{
        const mygroups = await user.findAll({ 
            where:{id:req.user.id},
            include: [{
                model:groups,
                attributes:['name','id']

            }]
            
         });
        res.status(201).json({mynewgroups:mygroups[0].dataValues.groups});
    }catch(err){
        console.log(err);
    }
}

exports.getChat = async(req,res,next)=>{
    try{
        const group = await groups.findAll({where:{name:req.body.groupname}});
       // console.log(group[0].dataValues.id);
        const result = await chats.findAll(
            {    
                where:{groupId:group[0].dataValues.id},
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