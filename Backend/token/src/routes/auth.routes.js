const express = require('express');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();


authRouter.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists with this email",

        })
    }


    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        email, password:hash, name
    })


    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
    );

    res.cookie("token", token, )

    res.status(201).json({
        message: "User registered successfully",
        user,
        token
    })



})




authRouter.post('/login', async (req,res)=>{
    const {email,password} = req.body
    
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message: "User not found with this email"
        })
    }


    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET,
    )

    res.cookie("token", token, { httpOnly: true, secure: false });

    res.status(200).json({
        message: "User logged in successfully",
        user
    })
})


module.exports = authRouter;