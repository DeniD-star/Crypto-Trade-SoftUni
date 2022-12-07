
const { parseError } = require('../util/parse');
const { isUser } = require('../middlewares/guards');
const storage = require('../middlewares/storage');
const { getUserByEmail } = require('../services/userService');

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
        const user = await getUserByEmail(req.user.email);
        console.log(user);
        crypto.hasUser = Boolean(req.user);
        crypto.isOwner = req.user && req.user._id == crypto.owner;
        crypto.bought = req.user && user.cryptoBuy.includes(crypto._id) // i tuk izpolzvam includes vmesto find
     console.log(Boolean(crypto.bought));
        res.render('details', {crypto})
        
    } catch (err) {
        console.log(err.message);
        res.redirect('/cryptos/404')
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

router.get('/delete/:id', isUser(), async(req, res)=>{
    try {

        const crypto = await req.storage.deleteCrypto(req.params.id);

        if (crypto.author != req.user._id) {
            throw new Error('Cannot delete a crypto you have not created!')
        }

        res.redirect('/cryptos/trade');

    } catch (err) {

        res.redirect('/cryptos/details/' + req.params.id)
    }
})

router.get('/buy/:id', isUser(), async(req, res) => {
    try {

        await req.storage.buyCrypto(req.params.id, req.user._id);

        res.redirect('/cryptos/details/' + req.params.id);

    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
})

router.get('/404', async(req, res) => {
   res.render('404')
})


router.get('/search', async(req, res)=>{
    const cryptos = await req.storage.getAllCryptos(req.query);
    res.render('search', {cryptos})
})
module.exports = router;