const mongoose = require('mongoose')


const schema = mongoose.Schema
const salesSchema = new schema({
    registration_id:{type:mongoose.Types.ObjectId,ref:"registration_tb"},
    order_id:{type:mongoose.Types.ObjectId,ref:"order_tb"},
    total:{type:String},
    quantity:{type:String},
    discount:{type:String},
    
})

const sales = mongoose.model('sales_tb',salesSchema)
module.exports=sales