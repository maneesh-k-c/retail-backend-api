const mongoose = require('mongoose')



const schema = mongoose.Schema
const productlistSchema = new schema({
    product_id:{type:mongoose.Types.ObjectId,ref:"product_tb"},
    productname:{type:String},
})

const productlist = mongoose.model('productlist_tb',productlistSchema)
module.exports=productlist