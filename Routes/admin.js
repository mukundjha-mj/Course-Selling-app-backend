const { Router } = require('express');

const adminRouter = Router();


adminRouter.use(adminMiddleware);

adminRouter.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    res.json({
        message: "signup endpoint"
    })

})
adminRouter.post('/signin', (req, res) => {
    res.json({
        message: "signin endpoint"
    })
})

adminRouter.post('/course', (req, res)=>{
    res.json({
        message: "signin endpoint"
    })
})

adminRouter.put('/course', (req, res)=>{
    res.json({
        message: "signin endpoint"
    })
})

adminRouter.get('/course/bulk', (req, res)=>{
    res.json({
        message: "signin endpoint"
    })
})

module.exports = ({
    adminRouter: adminRouter
})
