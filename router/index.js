const Router = require('express').Router();

const userRoute = require('./user');
const cartRoute = require('./cart');
const productRoute = require('./product');

Router.use('/user',userRoute);
Router.use('/cart',cartRoute);
Router.use('/product',productRoute);

module.exports = Router;