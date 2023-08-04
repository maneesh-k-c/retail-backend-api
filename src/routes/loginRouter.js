const express = require('express')
const loginRouter = express.Router()
var bcrypt = require('bcryptjs')
const registration = require('../models/registration')
const loginData = require('../models/loginData')
const counter = require('../models/counter')
const godown = require('../models/godown')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log("username",username);
    try {
        //console.log(req.body.username);
        const oldUser = await loginData.findOne({ username })   // to find user is alredy exist or not
       console.log(oldUser);
        if (!oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "User doesn't Exist"
            })
        }
        
        const passCheck= await bcrypt.compare(password,oldUser.password)
        console.log("user",passCheck);
        if (!passCheck) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Incorrect password"
            })
        }
        if(oldUser.role==="1"){
        if(oldUser.status =="1"){
            const userDetails = await registration.findOne({ login_id:oldUser._id})
            console.log(userDetails)
            if(userDetails){
                 return res.status(200).json({
                success: true,
                error: false,
                username:oldUser.username,
                //data:oldUser,
                role:oldUser.role,
                status:oldUser.status,
                login_id:oldUser._id,
                message: "Login Successfully",
                user_id:userDetails._id
            })
        }
        }
    else {
        res.status(200).json({
            success: false,
            error: true,
            login_id:oldUser._id,
            message: "waiting for admins approval"
        })
    }
}
    else if(oldUser.role === '2'){
     if (oldUser.status == "1"){
     const counterDetails =await counter.findOne({ login_id: oldUser._id})
     console.log("khjhdhgfhfhfhfhfh",counterDetails);
     if(counterDetails){
        res.status(200).json({
            success: true,
            error: false,
            username:oldUser.username,
            role:oldUser.role,
            status:oldUser.status,
            login_id:oldUser._id,
            // name: counterDetails.name,
            counter_id:counterDetails._id,
        })
     }
       
}
else {
    res.status(200).json({
        success: false,
        error: true,
        login_id:oldUser._id,
        message: "waiting for admins approval"
    })
}
    }   
    else if (oldUser.role === '3'){
        if (oldUser.status === "1"){
        const godownDetails = await godown.findOne({ login_id: oldUser._id})
        if(godownDetails){
           res.status(200).json({
               success: true,
               error: false,
               username:oldUser.username,
               role:oldUser.role,
               status:oldUser.status,
               login_id:oldUser._id,
               name: godownDetails.name,
               godown_id:godownDetails._id,
           })
        }
    
   }
   else {
       res.status(200).json({
           success: false,
           error: true,
           login_id:oldUser._id,
           message: "waiting for admins approval"
       })
   }
       }   
    }
    catch (err) {
        res.status(500).json({
        success: false,
        error: true,
        message: "Something went wrong"

})     
   }

})
    module.exports = loginRouter