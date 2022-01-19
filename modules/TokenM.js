const {Schema,model} = require('mongoose');

const TokenS = new Schema({
    userID: {type:Schema.Types.ObjectId, ref:'User'},
    refreshToken: String
});

module.exports = model('Token',TokenS);