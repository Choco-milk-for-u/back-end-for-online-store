const {Schema,model} = require('mongoose');

const UserS = new Schema({
    password: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    role: String,
    isActivated: {type:Boolean,default:false}
});

module.exports = model('User',UserS);