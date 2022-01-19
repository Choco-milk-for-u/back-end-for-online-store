const Router = require('express').Router();
const CartController = require('../controllers/cartController');

const checkCart = require('../midlleware/checkCart');

Router.post('/add',checkCart,CartController.addItem);
Router.get('/getAll',CartController.getAllItem);

module.exports = Router;