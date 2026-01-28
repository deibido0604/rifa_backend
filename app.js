const express = require('express');
const morgan = require('morgan');
const nocache = require('nocache');
const bearerToken = require('express-bearer-token');
const mung = require('express-mung');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const timeout = require('connect-timeout');
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

app.use(mung.json((body, req, res) => {
    body.message = body.message || 'Successfull request!';
    body.code = body.code ?? res.statusCode;
    body.success = body.code === 200;
    return body;
}));

app.use(morgan('combined'));
app.use(cors());
app.use(nocache());
app.use(helmet());
app.use(bearerToken());
app.use(timeout('200s'));

app.use('/api-rifa', require('./routes/index'));

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

module.exports = app;
