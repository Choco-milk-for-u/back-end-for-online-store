const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();

const app = express();
const cookie_parser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const errorMiddleWare = require('./midlleware/errorHandler');

const router = require('./router/index');

app.use(express.json());
app.use(cookie_parser());
app.use(cors());
app.use(express.static(path.resolve(__dirname,'static')));
app.use(fileUpload({}));
app.use('/api',router);

app.use(errorMiddleWare);
console.log('prepare to connecting');
const $port = process.env.PORT || 5000;

const start = async() =>{
    console.log('starting connection...');
    const $db = process.env.DB_URL

    await mongoose.connect($db,()=>{
        console.log("connected to datebase");
    });
}
start();

console.log("starting server");
    app.listen($port,()=>{
        console.log('server has started');
    });
