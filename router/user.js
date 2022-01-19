const Router = require('express').Router();
const userController = require('../controllers/userController');

Router.post('/registration',userController.regisrtation);
Router.post('/login',userController.login);

Router.get('/refresh',userController.refresh);
Router.get('/:link',userController.link)

module.exports = Router;