const mongoose = require('mongoose')


const schema = mongoose.Schema
const orderSchema = new schema({
    login_id:{type:mongoose.Types.ObjectId,ref:"login_tb"},
    product_id:{type:mongoose.Types.ObjectId,ref:"product_tb"},
    payment_id:{type:mongoose.Types.ObjectId,ref:"payment_tb"},
    
   
})

const order = mongoose.model('order_tb',orderSchema)
module.exports=order