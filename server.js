require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/MDBConnection');

connectDB();

module.exports = app;
