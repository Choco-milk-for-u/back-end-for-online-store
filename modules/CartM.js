const {Schema,model} = require('mongoose');

const CartS = new Schema({
    cartItemID: {type:Schema.Types.ObjectId,ref:'CartItem',required:true}
});

module.exports = model('Cart',CartS);