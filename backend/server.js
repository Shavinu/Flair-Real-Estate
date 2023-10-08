require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const createError = require('http-errors');
const routes = require('./routes');
const cors = require('cors');

app.use(cors({ credentials: true, origin: true }));

//middleware
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb' }));

//init routes
app.use('/', routes);

app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
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
