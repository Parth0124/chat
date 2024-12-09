import { response } from "express";
import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {compare} from 'bcrypt'

const maxAge = 3*24*60*60*1000;

const createToken = (email,userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY,{expiresIn: maxAge})
}

export const signup = async(req,res,next) => {
    try
    {
        const {email,password} = req.body;
        if(!email || !password)
        {
            return response.status(400).send("Email and password are necessary!")
        }
        const user = await User.create({email,password});
        res.cookie('jwt', createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:'None'
        })
        return res.status(201).json({user:{
            id: user._id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image,
            profileSetup: user.profileSetup
        }})
    }
    catch (error)
    {
        console.log({error});
        return res.status(500).send("Internal Server Error")
    }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response.status(400).send("Email and password are necessary!");
    }
    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).send("No User found. Please signup!")
    }
    const auth = await compare(password,user.password);
    if(!auth){
        res.status(404).send("Incorrect password! Please try again!");
    }
    res.cookie('jwt', createToken(email, user.id), {
        maxAge,
        secure:true,
        sameSite:'None'
    });
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
        color: user.color
      },
    }); 
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};

