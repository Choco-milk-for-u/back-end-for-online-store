const UserDB = require('../modules/UserM');
const LinkDB = require('../modules/LinkM');
const ApiError = require('../error/ApiError');

const hash = require('bcrypt');
const uuid = require('uuid');
const TokenSevice = require('../service/tokenService');
const EmailService = require('../service/emailService');

const userDto = require('../dtos/userDto');

class UserController {
    regisrtation = async (req, res, next) => {
        try {
            const { email, password, role } = req.body;

            /*Check Email and Password */
            const findEmail = await UserDB.findOne({ email });
            if (findEmail) {
                return next(ApiError.forbidden("email already has been registered"));
            }

            if (!password) {
                return next(ApiError.forbidden("cant find password"));
            }
            const hashedPassword = await hash.hash(password, 6);
            const candidate = await UserDB.create({ password: hashedPassword, email, role: role });
            
            /*Send email*/
            const link = uuid.v4();
            EmailService.sendEmail(email, "http://localhost:5000/api/user/" + link);


            /*Tokens*/
            const payload = new userDto(candidate);
            await LinkDB.create({ userID: payload.id, link: link });
            const tokens = await TokenSevice.generateTokens({ ...payload });


            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });


            res.json({ tokens });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }

    }
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const isHere = await UserDB.findOne({ email });

            if (!isHere) {
                return next(ApiError.forbidden('That email dosent registered there yet'));
            }

            if (!password) {
                return next(ApiError.badRequest('u dont input password'));
            }

            const checkPassword = isHere.password;
            const isMatch = await hash.compare(password, checkPassword);
            if (!isMatch) {
                return next(ApiError.forbidden('password is incorrect'));
            }

            const payload = new userDto(isHere);
            const tokens = await TokenSevice.generateTokens({ ...payload });

            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.json({ tokens });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }

    }
    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return next(ApiError.forbidden('can not find any refreshToken in cookie'));
            }
            const isGood = await TokenSevice.verifiTokenRefresh(refreshToken);
            if (!isGood) {
                return next(ApiError.forbidden('not right cookie'));
            }

            const user = await UserDB.findOne({ email: isGood.email });
            const payload = new userDto(user);
            const tokens = await TokenSevice.generateTokens(payload);

            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.json({ tokens });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }

    }
    link = async (req, res, next) => {
        try {
            const { link } = req.params;
            const isMatch = await LinkDB.find({ link });

            if (!isMatch) {
                return next(ApiError.forbidden('that user has not the link'));
            }

            if (link === isMatch[0].link) {
                const user = await UserDB.find(isMatch[0].userID);
                user[0].isActivated = true;
                await user[0].save();

                return res.redirect(process.env.CLIENT_API);
            }
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }


    }

}

module.exports = new UserController();