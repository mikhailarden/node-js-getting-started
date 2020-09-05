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

 .get('/production/cart.js', (req, res) => {
        res.render('/public/cart_function.js', {client_key : client_key},{client_pass : client_pass}, {orderKey : orderKey} );
    })
.post("/cart.js", (req, res) => {
        var key,
        pass,
        order,
        newKey = {key: client_key},
        newPass = {key: client_pass},
        orderKey = {key: order_auth};
        
        key.push(newKey);
pass.push(newPass);
order.push(orderKey);

        res.redirect("/cart.js");
    })
.listen(PORT, () => console.log(`Listening on ${ PORT }`))

require('dotenv').config()

console.log('Server listening on port 9000');