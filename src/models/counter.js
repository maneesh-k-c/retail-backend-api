const mongoose = require('mongoose')


const schema = mongoose.Schema
const counterSchema = new schema({
    login_id:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    name:{type:String},
    phonenumber:{type:String},
    email:{type:String},
    username:{type:String},
    
})

const counter = mongoose.model('counter_tb',counterSchema)
module.exports=counter