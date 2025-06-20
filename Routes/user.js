const { Router } = require('express');
const bcrypt = require("bcrypt");
const { z } = require("zod")
const jwt = require('jsonwebtoken');
const userRouter = Router();
const { userModel } = require("../DB/db")
const dotenv = require('dotenv')
dotenv.config();
const { userMiddleware } = require("../middleware/user")



userRouter.post('/signup', async (req, res) => {
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(20),
        firstName: z.string().min(5).max(50),
        lastName: z.string().min(1).max(50)
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if(!parseDataWithSuccess.success){
        res.status(403).json({
            message: "Incorrect Format",
            error: parseDataWithSuccess.error
        })
        return
    }

    const { email, password, firstName, lastName } = req.body;


    let errorThrown = false;
    try{
        const hashedPassword = await bcrypt.hash(password, 5);
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
    } catch(error){
        res.json({
            error: "User already exist"
        })
        errorThrown = true;
    }

    if(!errorThrown){
        res.json({
            message: "You are Registered."
        })
    }

})
userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({
        email: email
    })

    if(!findUser){
        res.status(403).json({
            message: "User dose not exist"
        })
        return
    }
    
    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if(passwordMatch){
        const token = jwt.sign({
            id: findUser._id.toString()
        }, process.env.JWT_SECRET);
        res.json({
            token: token
        });
    } else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})
userRouter.use(userMiddleware);


userRouter.get('/purchases', async (req, res) => {
    const user = await userModel.findById(req.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    

    res.json({
        firstName: user
    });
})


module.exports = {
    userRouter: userRouter
}