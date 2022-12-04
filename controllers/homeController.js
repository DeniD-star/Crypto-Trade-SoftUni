const router = require('express').Router();

router.get('/', async(req, res)=>{
    const cryptos = await req.storage.getAllCryptos()
    res.render('home', {cryptos})
})
module.exports = router;