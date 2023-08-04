const mongoose = require('mongoose')


const schema = mongoose.Schema
const registrationSchema = new schema({
    login_id:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    name:{type:String},
    phonenumber:{type:String},
    email:{type:String},
    username:{type:String},
})

const registration = mongoose.model('registration_tb',registrationSchema)
module.exports=registration