const express = require('express')
const bcrypt = require('bcryptjs')
const product = require('../models/product')
const productlist = require('../models/productlist')
const cart = require('../models/cart')
const productRouter = express.Router()

productRouter.get('/update-price', async (req, res) => {

    var products = {
        offerdetails: req.query.offerdetails
    }
    const id = req.query.id
    console.log("id", id, products);
    var productDetails = await product.updateOne({ _id: id }, { $set: products })
    if (productDetails.modifiedCount == 1) {

        return res.status(200).json({
            success: true,
            error: false,
            message: "Price updated",
        })
    }
    else {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Price not updated",

        })
    }
});


productRouter.get('/view-productdetails', (req, res) => {
    product.find()
        .then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No data found"
                })
            }

            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })
})
productRouter.get('/view_singleproductdetails/:id', (req, res) => {
    const id = req.params.id
    product.find({ _id: id })
        .then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })
})

productRouter.get('/offer_product', async (req, res) => {

    try {
        const pro = await product.find()


        const datas = pro.filter((data) => {
            return data.offerdetails != null
        })
        if (datas[0] == undefined) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                error: false,
                data: datas
            })
        }

    } catch (error) {

    }
})

productRouter.post('/update_offer_details/:id', (req, res) => {
    const { offerdetails } = req.body
    const id = req.params.id
    console.log(id);
    console.log(req.body);
    product.updateOne({ _id: id }, { $set: { offerdetails: req.body.offerdetails } }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Offer Updated"
        })
    }).catch(err => {
        return res.status(401).json({
            message: "something went wrong"
        })
    })
})

productRouter.get('/delete_offer_details/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    product.updateOne({ _id: id }, { $set: { offerdetails: null } }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Details Updated"
        })
    }).catch(err => {
        return res.status(401).json({
            message: "something went wrong"
        })
    })
})
productRouter.post('/add_to_cart/:id', (req, res) => {
    const { offerdetails } = req.body
    const id = req.params.id
    console.log(id);
    cart.updateOne({ _id: id }, { $set: { offerdetails } }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Details Updated"
        })
    }).catch(err => {
        return res.status(401).json({
            message: "something went wrong"
        })
    })
})
module.exports = productRouter

