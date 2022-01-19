const ApiError = require('../error/ApiError');

const ProductDB = require('../modules/ProductM');
const uuid = require('uuid');
const path = require('path');

class ProductController {
    create = async (req, res, next) => {
        try {
            const { name, type, gender, price } = req.body;
            const { img } = req.files;

            if (!name || !type || !gender || !price || !img) {
                return next(ApiError.forbidden('you supposed add all categorias'));
            }
            const fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const product = await ProductDB.create({ name, type, gender, price, img: fileName });

            return res.json(product);
        } catch (error) {
                return next(ApiError.badRequest(error.message));
        }


    }
    getAll = async(req,res,next)=>{
        try {
            const allProduct = await ProductDB.find();
            if(!allProduct){
                return next(ApiError.badRequest('we have no product yet'));
            }
            return res.json(allProduct);
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }
}
module.exports = new ProductController();