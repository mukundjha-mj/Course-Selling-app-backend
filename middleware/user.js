const dotenv = require('dotenv');
dotenv.config();
function userMiddleware(req, res, next){
    const token = req.headers.token;
    const response = jwt.verify(token, process.env.JWT_SECRET);
    
    if(response){
        req.userId = response.id;
        next();
    } else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

}

module.exports = {
    userMiddleware: userMiddleware
}