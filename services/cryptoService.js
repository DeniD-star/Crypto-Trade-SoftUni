const Crypto = require('../models/Crypto');
const User = require('../models/User');

async function createCrypto(cryptoData){
    const crypto = new Crypto(cryptoData);
    await crypto.save()
    return crypto;
}
async function getAllCryptos(){
    // const options = {};

    // if(query.search){
    //     options.name = { $regex: query.search, $options: 'i' }
    // }
    // if(query.search){
    //     options.paymentMethod = { $regex: query.search, $options: 'i' }
    // }
   const cryptos = await Crypto.find({}).lean();
   return cryptos;

}
async function getCryptoById(id){
   const crypto = await Crypto.findById(id).lean();
   return crypto;

}
async function editCrypto(cryptoId, cryptoData){
   const crypto = await Crypto.findById(cryptoId);
   crypto.name = cryptoData.name;
   crypto.imageUrl = cryptoData.imageUrl;
   crypto.price = Number(cryptoData.price);
   crypto.description = cryptoData.description;
   crypto.paymentMethod = cryptoData.paymentMethod;
   return crypto.save();

}


async function deleteCrypto(id){
    return Crypto.findByIdAndDelete(id);
}


async function buyCrypto(cryptoId, userId){
    const user = await User.findById(userId).populate('cryptoBuy');//zna4i tuk netrqbva6e da ima lean()
    const crypto = await Crypto.findById(cryptoId);

    if (crypto.owner == user._id) {
        throw new Error('Cannot add your own book!');
    }
    user.cryptoBuy.push(crypto);
    console.log(user.cryptoBuy , 'hello');
    return Promise.all([user.save(), crypto.save()]) 
}


async function getAllSearches(search) {
    if(search){
        return Crypto
            .find({ name: { $regex: search, $options: 'i' } })
            .lean();
    }
}
module.exports = {
    createCrypto,
    getAllCryptos,
    getCryptoById,
    editCrypto,
    deleteCrypto,
    buyCrypto,
    getAllSearches
}