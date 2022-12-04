const {Schema, model} = require('mongoose');

const schema = new Schema({
    name : {type: String, required: [true, 'Name is required!'], minLength: [2, 'Name must contain at least 2 characters!']},
    imageUrl: {type: String, required: [true, 'Image is required!'], match: [/^https?/, 'Image must be a valid URL!']},
    price: {type: Number, required: [true, 'Number is required!'], min: [0, 'Price is a positive number!']},
    description:{type: String, required: [true, 'Description is required!'], minLength: [10, 'Description must be at least 10 characters long!']},
    paymentMethod: {type: String, required: [true, 'Select a Payment Method!'], enum : ['crypto-wallet','credit-card', 'debit-card', 'paypal']},
    owner : {type: Schema.Types.ObjectId, ref: 'User'}
    
})

module.exports = model('Crypto', schema);