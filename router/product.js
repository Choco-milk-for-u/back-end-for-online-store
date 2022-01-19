const Router = require('express').Router();
const productController = require('../controllers/productController')

const roleChecker = require('../midlleware/checkRole');

Router.post('/create',roleChecker('ADMIN'),productController.create);
Router.get('/getAll',productController.getAll);

module.exports = Router;