const cryptoService = require('../services/cryptoService')

module.exports = () => (req, res, next) => {
    req.storage = {
        ...cryptoService
    };
    next()
}