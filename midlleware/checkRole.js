const ApiError = require('../error/ApiError');
const TokenService = require('../service/tokenService');

module.exports = function(role){
    return function(req,res,next){
        if(req.method === "OPTIONS"){
            next();
        }
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return next(ApiError.unauthorized('you have no token'));
        }
        const isGood = TokenService.verifiTokenAcces(token);
        if(!isGood){
            return next(ApiError.unauthorized('your token is incorrect')); 
        }
        if(isGood.role != role){
            return next(ApiError.forbidden('You have no permition for that'));
        }
        req.user = isGood;
        
        next();
    }
}