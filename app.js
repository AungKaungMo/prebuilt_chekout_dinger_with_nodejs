const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute.js');
const dingerRoute = require('./routes/dingerRoute.js');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/dinger", dingerRoute );

app.use((req, res, next) => {
    const err = new Error(`${req.url} not found.`);
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});


module.exports = app;
