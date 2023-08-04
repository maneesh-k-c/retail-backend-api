const mongoose = require('mongoose')


const schema = mongoose.Schema
const productSchema = new schema({
    productlist_id:{type:mongoose.Types.ObjectId,ref:"productlist_tb"},
    productname:{type:String},
    description:{type:String},
    quantity:{type:Number},
    photo:{type:String},
    price:{type:String},
    offerdetails:{type:String},
    
})

const product = mongoose.model('product_tb',productSchema)
module.exports=product