const mongoose = require('mongoose')


const schema = mongoose.Schema
const cartSchema = new schema({
    user_id:{type:mongoose.Types.ObjectId,ref:"registration_tb"},
    product_id:{type:mongoose.Types.ObjectId,ref:"product_tb"},
    quantity:{type:Number},
    date:{type:String},
    status:{type:String},
    
    
})

const cart = mongoose.model('cart_tb',cartSchema)
module.exports=cart