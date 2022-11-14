const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const port = process.env.PORT
app.use(express.json())

//Database
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error)=>{console.log(error)})
db.once('open',()=>{console.log("Database connected.")})

//Routes
const authRoutes = require('./routes/auth')
app.use('/auth',authRoutes)

app.listen(port,()=>{console.log(`Server running on port ${port}`);})