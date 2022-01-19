const {Schema,model} = require('mongoose');

const ProductS = new Schema({
    name: {type:String,required:true},
    type: {type:String,required:true},
    gender: String,
    price: Number,
    img: String
});

module.exports = model('Product',ProductS);