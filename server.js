const mongoose = require('mongoose')
var express = require("express")
var bodyParser = require('body-parser')
const adminRouter = require("./src/routes/adminRouter")
const registerRouter = require("./src/routes/registerRouter")
const paymentRouter = require("./src/routes/paymentRouter")
const salesRouter = require("./src/routes/salesRouter")
const counterRouter = require("./src/routes/counterRouter")
const cartRouter = require("./src/routes/cartRouter")
const deliveryRouter = require("./src/routes/deliveryRouter")
const orderRouter = require("./src/routes/orderRouter")
const loginRouter = require("./src/routes/loginRouter")
const godownRouter = require("./src/routes/godownRouter")
const productRouter = require("./src/routes/productRouter")


const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('./public'))
app.set('views','./src/views/')
app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render("login")
})
app.use('/admin',adminRouter)
app.use('/api/login',loginRouter)
app.use('/api/register',registerRouter)
app.use('/api/product',productRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/sales',salesRouter)
app.use('/api/counter',counterRouter)
app.use('/api/cart',cartRouter)
app.use('/api/delivery',deliveryRouter)
app.use('/api/order',orderRouter)
app.use('/api/godown',godownRouter)
//app.use('/api/approve',registerRouter)
//app.use('/api/approve',counterRouter)
//app.use('/api/approve',godownRouter)
//app.use('/api/offer',offerRouter)

const MONGODB_URL=
"mongodb+srv://farhanasherinmgm:farhanasherinmgm@cluster0.0v2mtcg.mongodb.net/retail_db?retryWrites=true&w=majority"


const port=2000;

mongoose.connect(MONGODB_URL).then(()=>{
    app.listen(port,()=>{
        console.log(`server running on port http://localhost:2000/`);
    })
}).catch((error)=>{
    console.log(` ${error} did not connect`); 
})