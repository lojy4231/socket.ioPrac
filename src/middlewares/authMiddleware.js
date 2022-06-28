const dotenv = require('dotenv');
dotenv.config()
const jwtSecret = process.env.JWTACCESSKEY;
const jwt = require("jsonwebtoken")

const { Users } = require("../models/")

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ');

        if (tokenType !== 'Bearer') {
            res.status(401).send({
                errorMessage: "로그인 후 이용해주세요"

            });
            return;
        }

        const userInfo = jwt.verify(tokenValue, jwtSecret);
        const nickname = userInfo.nickname

        Users.findOne({ nickname }).exec().then((user) => {
            res.locals.user = user;
            next();
        });


    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 이용해주세요"

        });
        return;
    }


};