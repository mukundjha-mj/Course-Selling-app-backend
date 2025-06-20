const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();



const { userRouter } = require('./Routes/user');
const { adminRouter } = require('./Routes/admin');
const { courseRouter } = require('./Routes/course');

const app = express();
app.use(express.json());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);






async function main() {


    await mongoose.connect(process.env.DATABASE_URL)

    app.listen(3000, () => {
        console.log("server is running on http://localhost:3000");
    })
}

main()