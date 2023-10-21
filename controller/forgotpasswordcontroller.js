var Brevo = require('@getbrevo/brevo');
var client = Brevo.ApiClient.instance;
var apiKey = client.authentications['api-key']
apiKey.apiKey = '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';

var transEmailApi = new Brevo.TransactionalEmailsApi(); 

const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');




exports.forgotpassword = async(req,res,next)=>{
    try{
        const user = await User.findOne({where : { email: req.body.email}});
        if(user){
            //console.log(user.dataValues.id);
            const id = uuid.v4();
            await Forgotpassword.create({id:id, isactive:true,userId:user.dataValues.id})

        const sender = {
            email:'monti242421@gmail.com'
        }
        
        const recievers = [
            {
                email: 'tarunkr242421@gmail.com'
            }
        ]
       var result = await transEmailApi.sendTransacEmail({
            sender,
            to:recievers,
            subject:" Just Testing",
            textContent:"Content",
            htmlContent:`<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`
        })
        console.log(result);
        res.json({message:"forgotpasswordrequest"});

        }else{
            res.json({message:"emailiddoesnotexist"});
        }
        
    }catch(err){
        console.log(err);
        res.status(401).json({message:"somethingwentwring"});
    }
    
}

exports.resetpassword = async (req,res,next)=>{
    const id = req.params.resetid
    var forgotpasswordrequest  = await Forgotpassword.findOne({ where : { id : id }})
    if(forgotpasswordrequest){
        forgotpasswordrequest.update({ active: false});
        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
    }

}

exports.updatepassword = async (req,res,next)=>{

    const resetpasswordid = req.params.updateid
    const newpassword = req.query;
    try{

    
    console.log(newpassword);
    var resetpasswordrequest = await Forgotpassword.findOne({ where : { id: resetpasswordid }})
    var user = await User.findOne({where: { id : resetpasswordrequest.userId}})

    if(user){
        const saltRounds = 10;
       // console.log(user);
        bcrypt.hash(newpassword.newpassword,saltRounds,async (err,hash)=>{
            console.log(err);
            await user.update({ password: hash })
           res.status(201).json({message: 'Successfuly update the new password'})
    
        })
    }else{
        res.json({message:"emailiddoesnotexist"});
    }
}catch(err){
    console.log(err);
    res.status(401).json({message:"somethingwentwring"});
}

}