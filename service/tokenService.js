const jwt = require('jsonwebtoken');
const TokenDB = require('../modules/TokenM');

class TokenService {
    generateTokens = async ({ email, role, id, isActivated }) => {

        const accesToken = jwt.sign({ email, role, id, isActivated }, process.env.JWT_KEY_ACCES, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ email, role, id, isActivated }, process.env.JWT_KEY_REFRESH, { expiresIn: "15d" });

        const candidate = await TokenDB.findOne({ userID: id });

        if (candidate) {
            candidate.refreshToken = refreshToken;
            candidate.save();

            return {
                accesToken, refreshToken
            }
        }

        await TokenDB.create({ userID: id, refreshToken: refreshToken });

        return {
            accesToken,
            refreshToken
        }
    }
    verifiTokenRefresh = (token) => {
        const isMatch = jwt.verify(token, process.env.JWT_KEY_REFRESH);
        return isMatch;
    }
    verifiTokenAcces = (token)=>{
        const isMatch = jwt.verify(token,process.env.JWT_KEY_ACCES);
        return isMatch;
    }
}

module.exports = new TokenService();