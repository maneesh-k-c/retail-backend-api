const mongoose = require('mongoose')


const schema = mongoose.Schema
const paymentSchema = new schema({
    login_id:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    paymenttype:{type:String},
    paymentdate:{type:String},
    amount:{type:String},
    paymentstatus:{type:String},
   
})

const payment = mongoose.model('payment_tb',paymentSchema)
module.exports=payment