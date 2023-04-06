require('dotenv').config()
const express = require('express')
const app = express()
const userRoutes = require('./routes/users')
const mongoose = require('mongoose')

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/users', userRoutes)

//connect to db
mongoose.connect(process.env.URI)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('connected to db on 4000')
    })
})
.catch((error) => {
    console.log(error)
})
