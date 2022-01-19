const ApiError = require('../error/ApiError');
const TokenService = require('../service/tokenService');


module.exports = (req,res,next)=>{
    if(req.method === 'OPTIONS'){
        next();
    }

    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        req.user = false;
        return next(ApiError.unauthorized('you have no permitsion for that'));
    }
    const isGood = TokenService.verifiTokenAcces(token);
    if(!isGood){
        res.user = false;
        return next(ApiError.unauthorized('you try to in, but have no permistion for that'))
    }
    req.user = isGood;
    next();
}