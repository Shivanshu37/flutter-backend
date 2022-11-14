const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const routes = express.Router()
const users = require('../model/user');
require('dotenv').config()
const verify = require('./verifyToken')
//Register
routes.post('/register',async (req,res)=>{

    //Check if user already exist
    const emailExists = await users.findOne({email:req.body.email})
    if(emailExists) return res.status(400).send("Email Already Exists.")

    //Hash password
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    //Create a new user
    const new_user = new users({username:req.body.username,email:req.body.email,password:hashedPassword})
    try
    {
        new_user.token = jwt.sign({_id:new_user._id},process.env.SECRET_TOKEN,{expiresIn:5*60})
        const savedUser = await new_user.save()
        res.status(200).send({user_id:new_user._id,token:new_user.token})
    }
    catch(err)
    {
        res.status(400).send(err)
    }
})

//Login
routes.post('/login',async (req,res)=>{
    //Checking if user exists
    const user = await users.findOne({email:req.body.email})
    if(!user) return res.status(400).send("User does not exist!")

    //Checking password
    const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password)
    if(!isPasswordCorrect){ return res.status(400).send("Invalid Password!")}

    //Create token 
    const Newtoken = jwt.sign({_id:user._id},process.env.SECRET_TOKEN,{expiresIn:5*60})
    await users.updateOne({email:req.body.email},{token:Newtoken})
    res.header('auth-token',Newtoken).send({id:user._id,token:Newtoken})
})

routes.get('/verifyToken',verify,(req,res)=>{
    res.send(req.user);
})




module.exports = routes;