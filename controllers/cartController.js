const ApiError = require('../error/ApiError');
const ProductDB = require('../modules/ProductM');
const CartDB = require('../modules/CartM');
const CartItemDB = require('../modules/CartItemM');
const TokenService = require('../service/tokenService');

const uudi = require('uuid');
class CartController {
    addItem = async (req, res, next) => {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest('no item to add'));
            }
            const isHere = await ProductDB.findOne({ name });
            if (!isHere) {
                return next(ApiError.badRequest('we have no that product here'));
            }
            const isUser = req.user;

            if (!isUser) {

                const { old_id } = req.body;
                const findGuest = await CartItemDB.findOne({ questID: old_id });

                let id;

                if (!findGuest) {
                    id = uudi.v4();
                    const guses = await CartItemDB.create({ questID: id, productID: isHere._id });
                }
                else {
                    findGuest.productID.push(isHere._id);
                    await findGuest.save();
                }

                //const cartGues = await CartDB.create({ cartItemID: guses._id });


                return res.status(200).send(id); // for save in localstorage id
            }
            else {
                const isUserHere = await CartItemDB.findOne({ userID: isUser.id });

                if (isUserHere) {
                    isUserHere.productID.push(isHere._id);
                    await isUserHere.save();
                    
                    return res.json({ message: 'good' });
                }
                else {


                    const addedProduct = await CartItemDB.create({ userID: isUser.id, productID: isHere._id });
                    //const cart = await CartDB.create({ cartItemID: addedProduct._id });

                    return res.status(200).send({ status: 1, message: "create authorization cart" });
                }
            }
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }


    }
    getAllItem = async (req, res, next) => {

        const { userID, questID } = req.body;

        if (!userID || questID) {
            const quest = await CartItemDB.findOne({ questID });

            if (!quest) {
                return next(ApiError.forbidden('error with getting data from cart'));
            }

            let products = [];
            for (let index = 0; index < quest.productID.length; index++) {
                const prop = quest.productID[index];


                const product = await ProductDB.findOne({ _id: prop });
                products.push(product);
            }
            return res.json(products);
        }
        const user = await CartItemDB.findOne({ userID });
        if (!user) {
            return next(ApiError.forbidden('error with getting data from cart'));
        }
        let products = [];
        for (let index = 0; index < user.productID.length; index++) {
            const prop = user.productID[index];


            const product = await ProductDB.findOne({ _id: prop });
            products.push(product);
        }
        return res.json(products);
    }
}

module.exports = new CartController();