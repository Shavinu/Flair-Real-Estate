require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const mongoose = require('mongoose');
const createError = require('http-errors');

//middleware
app.use(express.json());

//routeS
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    next(createError.NotFound('This route does not exist'));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
});

//connect to db
mongoose
    .connect(process.env.URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db on ', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });
