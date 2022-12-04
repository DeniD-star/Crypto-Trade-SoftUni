const { isUser } = require('../middlewares/guards');
const storage = require('../middlewares/storage');

const router = require('express').Router();

router.get('/create', isUser(), async(req, res)=>{
    res.render('create')
})
router.post('/create', isUser(), async(req, res)=>{
    try {
        
        const cryptoData = {
            name : req.body.name,
            imageUrl: req.body.imageUrl,
            price: Number(req.body.price),
            description:req.body.description,
            paymentMethod: req.body.paymentMethod,
            owner : req.user._id
        }

        await req.storage.createCrypto(cryptoData);
        res.redirect('/cryptos/trade')
    } catch (err) {
        console.log(err.message);
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);
        } else {
            errors = [err.message]
        }

        const ctx = {
            errors,
            cryptoData: {
                name : req.body.name,
            imageUrl: req.body.imageUrl,
            price: Number(req.body.price),
            description:req.body.description,
            paymentMethod: req.body.paymentMethod,
           
            }
        }
        res.render('create', ctx)
    }
})

router.get('/trade', async(req, res)=>{
    const cryptos = await req.storage.getAllCryptos();
    res.render('catalog', { cryptos })
})
module.exports = router;