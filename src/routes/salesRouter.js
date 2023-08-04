const express = require('express')
const sales= require('../models/sales')

const salesRouter = express.Router()
salesRouter.post('/',async(req,res)=>{

var sale = {
    
    total: req.body.total,
    quantity: req.body.quantity,
    discount: req.body.discount,
    
}
var salesDetails = await sales(sale).save()
if (salesDetails) {
    return res.status(200).json({
        success: true,
        error: false,
        data: salesDetails,
    })
}

})
module.exports = salesRouter

