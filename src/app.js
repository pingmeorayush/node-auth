const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/apiRoutes/userRoutes');
const authRouter = require('./routes/authRoutes/authRoutes');

const app = express();

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api/v1', userRouter);
app.use('/api/v1', authRouter);

module.exports = app;
