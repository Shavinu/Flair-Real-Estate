require('dotenv').config()
const express = require('express')
const app = express()
 
//middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.get('/', (req, res) =>{
    res.json({mssg: 'welcome to the app'})
})

app.listen(process.env.PORT, () => {
    console.log('listering on port 3000')
})
