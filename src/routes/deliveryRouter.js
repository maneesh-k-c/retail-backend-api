const express = require('express')
const loginData = require('../models/loginData')
const delivery = require('../models/delivery')

const deliveryRouter = express.Router()
deliveryRouter.post('/', async (req, res) => {
    try {
        console.log(req.body.username);
        const oldUser = await loginData.findOne({ username: req.body.username })   // to find user is alredy exist or not
        console.log(oldUser);
        if (oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "username already exist!"
            })
        }


        var deliveryDetails = {
            username: req.body.username,
            password: req.body.password,
            role: 1
        }
        var result = await loginData(loginDetails).save()
        if (result) {
            var del = {
                login_id: result._id,
                product_id: result._id,
                deliverystatus: req.body.deliverystatus,
                paymentstatus: req.body.paymentstatus,
            }
            var deliveryDetails = await delivery(del).save()
            if (deliveryDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: deliveryDetails,
                    message: "delivery completed"
                })
            }
        }

    } catch (err) {

    }
})

module.exports = deliveryRouter