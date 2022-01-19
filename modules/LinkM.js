const {Schema,model} = require('mongoose');

const LinkS = new Schema({
    userID: {type:Schema.Types.ObjectId, ref:'User'},
    link: String
});

module.exports = model('Link',LinkS);