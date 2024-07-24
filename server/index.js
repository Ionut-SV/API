const express = require ('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoute.js')
const fileRouter = require('./routes/fileRoute.js');
const userRouter = require('./routes/userRoute.js');
const cookieParser = require('cookie-parser');

const app = express();

 //MiddleWares
 app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

 //Routes
 app.use('/api/user', userRouter);
app.use ('/api/auth', authRouter);
app.use('/api/files', fileRouter);

 //MongoDB Connection
mongoose
    .connect('mongodb://127.0.0.1:27017/authentication')
    .then(() => console.log('Connected to MongoDB!'))
    .catch((error)=>console.error("Failed to connect to MongoDB:", error));

 //Error Handling
app.use((err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
});

 //Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
});