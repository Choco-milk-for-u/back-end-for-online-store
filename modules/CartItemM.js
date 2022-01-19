const {Schema,model} = require('mongoose');

const CartItemS = new Schema({
    userID: {type:Schema.Types.ObjectId, ref:'User'},
    productID: [{type:Schema.Types.ObjectId, ref:'Product'}],
    questID:{type:String,required:false}
});

module.exports = model('CartItem',CartItemS);