

const jwt = require("jsonwebtoken");
require('dotenv').config();
const  Token  = require("./models/token");


// verify a token symmetric - synchronous
 
verifyToken = async(req, res, next) => {

    const token = req.headers["x-access-token"];
    console.log("hello req",token)

    if (!token) {
        return res.send({
            status: "bad request",
            status_code: 400,
            message: "No token provided",
            error: ""
        });
    }
    const isTokenAvailable = await Token.findOne( { token: token });
    // console.log("isTokenAvailable",isTokenAvailable)
    if (!isTokenAvailable) {
     console.log("isTokenAvailable",isTokenAvailable)
        return res.send({
            status: "bad request",
            status_code: 400,
            message: "bad request not token provided",
            error: ""
        });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.send({
                status: "unauthorized",
                status_code: 401,
                message: "unauthorized token provided",
                error: ""
            });
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    isAuth: verifyToken
}