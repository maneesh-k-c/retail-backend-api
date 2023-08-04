const express = require('express')
const loginData = require('../models/loginData')
const payment = require('../models/payment')
const order = require('../models/order')
const orderRouter = express.Router()
orderRouter.post('/', async (req, res) => {
    try {
        var loginDetails = {
            username: req.body.username,
            password: req.body.password,
            role: 1
        }
        var result = await loginData(loginDetails).save()
        var paymentDetails = {
            paymenttype: req.body.paymenttype,
            paymentdate: req.body.paymentdate,
            amount: req.body.amount,
            paymentstatus: req.body.paymentstatus,  
        }
        var results = await payment(paymentDetails).save()
       
        if (result) {
            var ord = {
                login_id: result._id,
                product_id: result._id,
                payment_id: results._id,
               
            }
            var orderDetails = await order(ord).save()
            if (orderDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: orderDetails,
                    message: "order completed"
                })
            }
        }

    } catch (err) {

    }
})
module.exports = orderRouter