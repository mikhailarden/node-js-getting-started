const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();


const client_key = 'fakeToken';
const client_pass = 'nonFake';
const order_auth = 'nonFake';

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cart.js', (req, res) => res.sendFile(__dirname + '/public/cart_function.js'))
    .get('/production/cart.js', function(req, res) {
        res.render(__dirname + '/public/cart_function.js', { token: client_key }, { pass: client_pass }, { order_auth: order_auth });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

require('dotenv').config()

console.log('Server listening on port 9000');