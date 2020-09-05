const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();


const client_key = process.env.CLIENT_KEY;
const client_pass = process.env.CLIENT_PASS;
const order_auth = process.env.BASIC_AUTH;

express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/cart.js', (req, res) => res.sendFile(__dirname + '/public/cart_function.js'))
 .post("/cart.js", (req, res) => {
            var key = req.body.key,
            newKey = {key: client_key},
            pass,
            newPass = {pass: client_pass},
            order,
            orderKey = {order: order_auth};
            
            key.push(newKey);
            pass.push(newPass);
            order.push(orderKey);
            res.redirect("/cart.js");
        })
.listen(PORT, () => console.log(`Listening on ${ PORT }`))

require('dotenv').config()

console.log('Server listening on port 9000 test');