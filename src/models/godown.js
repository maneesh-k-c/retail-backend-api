const mongoose = require('mongoose')


const schema = mongoose.Schema
const godownSchema = new schema({
    login_id:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    name:{type:String},
    phonenumber:{type:String},
    email:{type:String},
    username:{type:String},
    
   
})

const godown = mongoose.model('godown_tb',godownSchema)
module.exports=godown