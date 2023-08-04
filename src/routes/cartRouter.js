const express = require('express')
const loginData = require('../models/loginData')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId
const cart = require('../models/cart')
const product = require('../models/product')

const cartRouter = express.Router()

cartRouter.get('/update_order_status_counter/:id', async (req, res) => {
    try {
        const id = req.params.id
        await cart.updateOne(
            { _id: id },
            { $set: { status: 3 } }
        );



        return res.status(201).json({
            success: true,
            error: false,
            message: "status Updated!"
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.post('/add', async (req, res) => {
    console.log("hshdhsh", req.body)

    try {
        const old = await cart.findOne({ user_id: req.body.user_id, product_id: req.body.product_id, status: 0 })
        if (old) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Product already in cart"
            })
        }
        var loginDetails = {
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            quantity: 1,
            status: 0
        }
        console.log(loginDetails);
        var result = await cart(loginDetails).save()


        if (result) {
            return res.status(200).json({
                success: true,
                error: false,
                data: result,
                message: "Added to Cart"
            })
        }


    } catch (err) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/order_status_2/', async (req, res) => {
    try {
        const id = req.params.id
        // const data = await cart.find({ user_id: id, status: 0 })
        const data = await cart.aggregate([
            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'product_id',
                    'foreignField': '_id',
                    'as': 'product'
                }
            },
            {
                '$lookup': {
                    'from': 'registration_tbs',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$unwind": "$product"
            },
            {
                "$match": {
                    "status": "2"
                }
            },
            {
                "$group": {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'date': { '$first': '$date' },
                    'productname': { '$first': '$product.productname' },
                    'description': { '$first': '$product.description' },
                    'photo': { '$first': '$product.photo' },
                    'price': { '$first': '$product.price' },
                    'name': { '$first': '$user.name' },
                    'phonenumber': { '$first': '$user.phonenumber' },
                    'email': { '$first': '$user.email' },

                }
            }
        ])

        data.forEach((item) => {
            item.total = item.price * item.quantity;
        });

        let totalValue = 0;

        for (const item of data) {
            totalValue += item.total;
        }

        data.forEach((item) => {
            item.total_amount = totalValue;
        });

        if (data[0] === undefined) {
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
                data: data,

            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/view_cart/:id', async (req, res) => {
    try {
        const id = req.params.id
        // const data = await cart.find({ user_id: id, status: 0 })
        const data = await cart.aggregate([
            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'product_id',
                    'foreignField': '_id',
                    'as': 'product'
                }
            },
            {
                "$unwind": "$product"
            },
            {
                "$match": {
                    "user_id": new objectId(id)
                }
            },
            {
                "$match": {
                    "status": "0"
                }
            },
            {
                "$group": {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'productname': { '$first': '$product.productname' },
                    'description': { '$first': '$product.description' },
                    'photo': { '$first': '$product.photo' },
                    'price': { '$first': '$product.price' },

                }
            }
        ])

        data.forEach((item) => {
            item.total = item.price * item.quantity;
        });

        let totalValue = 0;

        for (const item of data) {
            totalValue += item.total;
        }

        data.forEach((item) => {
            item.total_amount = totalValue;
        });

        if (data[0] === undefined) {
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
                data: data,

            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/increment/:id', async (req, res) => {
    try {
        const id = req.params.id
        const old = await cart.findOne({ _id: id })
        console.log(old);
        const counts = old.quantity + 1

        const add = await cart.updateOne({ _id: id }, { $set: { quantity: counts } })

        if (add.modifiedCount === 1) {
            const old_product = await product.findOne({ _id: old.product_id })
            const available_counts = old_product.quantity + 1
            const products = await product.updateOne({ _id: old.product_id }, { $set: { quantity: available_counts } })

            return res.status(201).json({
                success: true, error: false,
                message: "updated"
            })
        } else {
            return res.status(400).json({
                success: false, error: true,
                message: "error"
            })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, error: true, message: 'Something Went Wrong' })
        console.log(err)
    }
})

cartRouter.get('/decrement/:id', async (req, res) => {
    try {
        const id = req.params.id
        const old = await cart.findOne({ _id: id })
        if (old.quantity > 1) {
            const counts = old.quantity - 1

            const add = await cart.updateOne({ _id: id }, { $set: { quantity: counts } })

            if (add.modifiedCount === 1) {
                const old_product = await product.findOne({ _id: old.product_id })
                const available_counts = old_product.quantity - 1
                const products = await product.updateOne({ _id: old.product_id }, { $set: { quantity: available_counts } })

                return res.status(201).json({
                    success: true, error: false,
                    message: "updated"
                })
            } else {
                return res.status(400).json({
                    success: false, error: true,
                    message: "error"
                })
            }
        } else {
            return res.status(400).json({
                success: false, error: true,
                message: "Quantity cannot be less than 1"
            })
        }

    }
    catch (err) {
        res.status(500).json({ success: false, error: true, message: 'Something Went Wrong' })
        console.log(err)
    }
})

cartRouter.get('/delete_cart/:id', async (req, res) => {
    const id = req.params.id
    try {
        cart.deleteOne({ _id: id }).then((data) => {
            if (data.deletedCount === 1) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "Data Deleted From Cart"
                })
            }
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.post('/proceed-to-buy/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        const carts = await cart.find({ user_id: id, status: 0 })
        for (let i = 0; i < carts.length; i++) {
            const c_id = carts[i]._id
            await cart.updateOne({ _id: c_id }, { $set: { status: 1 } })
        }
        res.status(201).json({
            success: true, error: false,
            message: 'Complete'
        })
    }
    catch (err) {
        res.status(500).json({ success: false, error: true, message: 'Something Went Wrong' })
        console.log(err)
    }
})

cartRouter.get('/buy_now/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await cart.find({ user_id: id, status: 0 })
        const dateString = new Date()
        const date = new Date(dateString);
        const formattedDate = date.toISOString().split('T')[0];
        for (const item of data) {
            await cart.updateOne(
                { _id: item._id },
                { $set: { status: 1, date: formattedDate } }
            );
        }


        return res.status(201).json({
            success: true,
            error: false,
            message: "Order Placed!"
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/view_purchased_products/:id', async (req, res) => {
    try {
        const id = req.params.id
        // const data = await cart.find({ user_id: id, status: 0 })
        const data = await cart.aggregate([
            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'product_id',
                    'foreignField': '_id',
                    'as': 'product'
                }
            },
            {
                "$unwind": "$product"
            },
            {
                "$match": {
                    "user_id": new objectId(id)
                }
            },
            {
                "$match": {
                    "status": "1"
                }
            },
            {
                "$group": {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'productname': { '$first': '$product.productname' },
                    'description': { '$first': '$product.description' },
                    'photo': { '$first': '$product.photo' },
                    'price': { '$first': '$product.price' },
                    'status': { '$first': '$status' },
                    'product_id': { '$first': '$product._id' },
                }
            }
        ])

        data.forEach((item) => {
            item.total = item.price * item.quantity;
        });

        let totalValue = 0;

        for (const item of data) {
            totalValue += item.total;
        }

        data.forEach((item) => {
            item.total_amount = totalValue;
        });

        if (data[0] === undefined) {
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
                data: data,

            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/order_status/:id', async (req, res) => {
    try {
        const id = req.params.id
        // const data = await cart.find({ user_id: id, status: 0 })
        const data = await cart.aggregate([
            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'product_id',
                    'foreignField': '_id',
                    'as': 'product'
                }
            },
            {
                '$lookup': {
                    'from': 'registration_tbs',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$unwind": "$product"
            },
            {
                "$match": {
                    "status": "1"
                }
            },
            {
                "$match": {
                    "user._id": new objectId(id)
                }
            },
            {
                "$group": {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'date': { '$first': '$date' },
                    'productname': { '$first': '$product.productname' },
                    'product_id': { '$first': '$product._id' },
                    'description': { '$first': '$product.description' },
                    'photo': { '$first': '$product.photo' },
                    'price': { '$first': '$product.price' },
                    'name': { '$first': '$user.name' },
                    'user_id': { '$first': '$user._id' },
                    'phonenumber': { '$first': '$user.phonenumber' },
                    'email': { '$first': '$user.email' },

                }
            }
        ])

        data.forEach((item) => {
            item.total = item.price * item.quantity;
        });

        let totalValue = 0;

        for (const item of data) {
            totalValue += item.total;
        }

        data.forEach((item) => {
            item.total_amount = totalValue;
        });

        if (data[0] === undefined) {
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
                data: data,

            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})


cartRouter.get('/online_delivery_order/', async (req, res) => {
  
    try {
      const total = await cart.aggregate([
        {
            '$lookup': {
                'from': 'registration_tbs',
                'localField': 'user_id',
                'foreignField': '_id',
                'as': 'user'
            }
        },
        {
            "$unwind": "$user"
        },
        
        {
            "$match": {
                "status": "1"
            }
        },
        
        { $group: { '_id': '$user_id', 'name': { '$first': '$user.name' },'user_id': { '$first': '$user._id' } } },
      ]);
  
      if (total.length > 0) {
        return res.status(200).json({
          data: total,
          message: 'Success',
          success: true,
        });
      } else {
        return res.status(404).json({
          data: 'No data available',
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        success: false,
      });
    }
  });

cartRouter.get('/delivery_status/', async (req, res) => {
    try {
        const id = req.params.id
        // const data = await cart.find({ user_id: id, status: 0 })
        const data = await cart.aggregate([
            {
                '$lookup': {
                    'from': 'product_tbs',
                    'localField': 'product_id',
                    'foreignField': '_id',
                    'as': 'product'
                }
            },
            {
                '$lookup': {
                    'from': 'registration_tbs',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$unwind": "$product"
            },

            {
                "$group": {
                    '_id': '$_id',
                    'quantity': { '$first': '$quantity' },
                    'status': { '$first': '$status' },
                    'date': { '$first': '$date' },
                    'productname': { '$first': '$product.productname' },
                    'description': { '$first': '$product.description' },
                    'photo': { '$first': '$product.photo' },
                    'price': { '$first': '$product.price' },
                    'name': { '$first': '$user.name' },
                    'phonenumber': { '$first': '$user.phonenumber' },
                    'email': { '$first': '$user.email' },

                }
            }
        ])

        data.forEach((item) => {
            item.total = item.price * item.quantity;
        });

        let totalValue = 0;

        for (const item of data) {
            totalValue += item.total;
        }

        data.forEach((item) => {
            item.total_amount = totalValue;
        });

        if (data[0] === undefined) {
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
                data: data,

            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/update_order_status/:id', async (req, res) => {
    try {
        const id = req.params.id
        await cart.updateOne(
            { _id: id },
            { $set: { status: 2 } }
        );



        return res.status(201).json({
            success: true,
            error: false,
            message: "status Updated!"
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Something went wrong"
        })
    }
})

module.exports = cartRouter