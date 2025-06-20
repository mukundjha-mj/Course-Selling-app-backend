const { Router } = require('express');
const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt");
const { z } = require("zod")

const adminRouter = Router();

const { adminModel, courseModel } = require("../DB/db")
const dotenv = require('dotenv')
dotenv.config();

const { adminMiddleware } = require("../middleware/admin");




adminRouter.post('/signup', async (req, res) => {
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(20),
        firstName: z.string().min(5).max(50),
        lastName: z.string().min(1).max(50)
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        res.json({
            message: "Incorrect Format",
            error: parseDataWithSuccess.error
        })
        return
    }

    const { email, password, firstName, lastName } = req.body;


    let errorThrown = false;
    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
    } catch (error) {
        res.json({
            error: "User already exist"
        })
        errorThrown = true;
    }

    if (!errorThrown) {
        res.json({
            message: "You are Registered."
        })
    }



})
adminRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const findAdmin = await adminModel.findOne({
        email: email
    })

    if (!findAdmin) {
        res.status(403).json({
            message: "User dose not exist"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, findAdmin.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: findAdmin._id.toString()
        }, process.env.JWT_SECRET);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

adminRouter.use(adminMiddleware);

adminRouter.post('/course', async (req, res) => {
    const adminId = req.userId;

    const { title, description, imageUrl, Price } = req.body;
    const course = await courseModel.create({
        title, description, imageUrl, Price, creatorId: adminId
    })
    res.json({
        message: "course created",
        courseId: course._id
    })
})


adminRouter.put('/course', adminMiddleware, (req, res) => {
    const adminId = req.userId;

    res.json({
        message: "signin endpoint"
    })
})

adminRouter.get('/course/bulk', (req, res) => {
    res.json({
        message: "signin endpoint"
    })
})

module.exports = ({
    adminRouter: adminRouter
})
