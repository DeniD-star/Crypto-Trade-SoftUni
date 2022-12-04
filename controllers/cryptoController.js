
const { parseError } = require('../util/parse');
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

router.get('/details/:id', async(req, res)=>{
    try {

        const crypto = await req.storage.getCryptoById(req.params.id);
        crypto.hasUser = Boolean(req.user);
        crypto.isOwner = req.user && req.user._id == crypto.owner;
        res.render('details', {crypto})
        
    } catch (err) {
        console.log(err.message);
        res.redirect('/404')
    }
})

router.get('/edit/:id', isUser(), async(req, res)=>{
    const crypto = await req.storage.getCryptoById(req.params.id);
    res.render('edit', {crypto})
})
router.post('/edit/:id', isUser(), async(req, res)=>{
    try {

        const crypto = await req.storage.getCryptoById(req.params.id);
        if (crypto.owner != req.user._id) {
            throw new Error('You cannot edit a crypto you have not created!')
        }

        await req.storage.editCrypto(req.params.id, req.body)
        res.redirect('/cryptos/trade')
    } catch (err) {
        console.log(err.message);

        const ctx = {
            errors: parseError(err),
            crypto: {
                _id: req.params.id,
                name : req.body.name,
                imageUrl: req.body.imageUrl,
                price: Number(req.body.price),
                description:req.body.description,
                paymentMethod: req.body.paymentMethod,
            }
        }
        res.render('edit', ctx)
    }
})
module.exports = router;