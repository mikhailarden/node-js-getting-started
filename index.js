const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cart.js', (req, res) => res.sendfile(__dirname + '/public/cart_function.js'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))


console.log('Server listening on port 9000');