const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();




express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/cart.js', (req, res) => res.sendFile(__dirname + '/public/cart_function.js'))
    .post('/production/cart.js', (req, res) => {
        const client_key = 'fakeToken';
        const client_pass = 'nonFake';
        const order_auth = 'nonFake';

        res.render('/public/cart_function.js', {client_key});
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

require('dotenv').config()

console.log('Server listening on port 9000 test');