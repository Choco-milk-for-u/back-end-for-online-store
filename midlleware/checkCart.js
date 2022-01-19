const TokenService = require('../service/tokenService');

module.exports = (req,res,next) =>{
    if(req.method === 'OPTIONS'){
        next();
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        req.user = false;
        
    }
    else{
        const data = TokenService.verifiTokenAcces(token);
        req.user = data;
    }
     next();
}