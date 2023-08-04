const express = require('express')
const loginData = require('../models/loginData')
const registration = require('../models/registration')
var bcrypt = require('bcryptjs');

const registerRouter = express.Router()

registerRouter.post('/', async (req, res) => {
    console.log("data"+JSON.stringify(req.body))
    try {
        console.log(req.body.username);
        const oldUser = await loginData.findOne({ username: req.body.username })   // to find user is alredy exist or not
        console.log(oldUser);
        if (oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "username already exist!"
            });
        }

        const hashedPass = await bcrypt.hash(req.body.password, 12);
        const oldphone= await registration.findOne({phonenumber:req.body.phonenumber});
        if (oldphone) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Phone number already exist!"
            });
        }
        const oldemail= await registration.findOne({email:req.body.email});
        if (oldemail) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Email id already exist!"
            });
        }

        var loginDetails = {
            username: req.body.username,
            password: hashedPass,
            role: 1,
            status:0
        }
        var result = await loginData(loginDetails).save()
        if (result) {
            var reg = {
                login_id: result._id,
                name: req.body.name,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                username: req.body.username,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                
            }
            var registerDetails = await registration(reg).save()
            if (registerDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: registerDetails,
                    message: "Registration completed"
                })
            }
        }

    } catch (err) {
         res.status(500).json({
         success: false,
         error: true,
                    data: registerDetails,
                    message: "Something went wrong"

});
console.log(err);        
    }
})
registerRouter.get('/approve/:id',(req,res)=>{
    const id=req.params.id
    console.log(id);
    loginData.find({_id:id}).then((data)=>{
        console.log("ddd==>",data[0]);
        if(data[0].status ==='0'){
            loginData.updateOne({_id:id},{$set:{status:"1"}}).then((user)=>{
                console.log(user);
                res.status(200).json({
                    success:true,
                    error:false,
                    message:"approved"
                })
            }).catch(err =>{
                return res.status(401).json({
                    message:"something went wrong!"
                })
            })
        }
        else if (data[0].status === '1'){
         loginData.updateOne({_id:id},{$set:{status:0}}).then((user) =>{
            console.log(user);
            res.status(200).json({
                success:true,
                    error:false,
                    message:"disapproved"
            })
         }).catch(err =>{
            return res.status(401).json({
                message:"something went wrong!"
            })
        })
        }
        }).catch(err =>{
            return res.status(401).json({
                message:"something went wrong!"
            })
        })
    })
    registerRouter.get('/view_user/:id',(req,res)=>{
        const id=req.params.id
        registration.find({login_id:id}).then(function(data){
            if(data == 0){
                return res.status(401).json({
                    success:false,
                    error:true,
                    message:"No Data Found!"
                })
            }
              else{
                return res.status(200).json({
                    success:true,
                    error:false,
                    data: data
              })
                    }
                     })
                })
     registerRouter.post('/update_user_profile/:id',(req,res)=>{
        const {name,email,phonenumber,username}= req.body
        const id= req.params.id
        console.log(id);
        registration.updateOne({_id: id},{ $set:{name,email,phonenumber,username} }).then((data)=>{
            console.log(data);
            res.status(200).json({
                success: true,
                error: false,
                message:"Details Updated"
            })
        }).catch(err=>{
            return res.status(401).json({
              message: "something went wrong"  
            })
        })
     })          
module.exports = registerRouter