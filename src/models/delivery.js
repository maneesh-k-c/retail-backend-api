const mongoose = require('mongoose')


const schema = mongoose.Schema
const deliverySchema = new schema({
    login_id:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    paymenttype:{type:String},
    paymentdate:{type:String},
    amount:{type:String},
    paymentstatus:{type:String},
   
})

const delivery = mongoose.model('delivery_tb',deliverySchema)
module.exports=delivery