const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const cryptoController = require('../controllers/cryptoController');

module.exports=(app)=>{
    app.use('/auth', authController)
    app.use('/', homeController)
    app.use('/cryptos', cryptoController)
}