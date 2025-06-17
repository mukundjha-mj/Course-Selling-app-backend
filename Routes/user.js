const { Router } = require('express');

const userRouter = Router();
const { userModel } = require("../DB/db")


userRouter.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    res.json({
        message: "signup endpoint"
    })

})
userRouter.post('/signin', (req, res) => {
    res.json({
        message: "signin endpoint"
    })
})


userRouter.get('/purchases', (req, res) => {

})


module.exports = {
    userRouter: userRouter
}