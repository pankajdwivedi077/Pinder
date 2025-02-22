import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
    // jwt token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

export const signup = async (req, res) => {

    const { name, email, password, age, gender, genderPreference } = req.body;

   try{

     if(!name || !email || !password || !age || !gender || !genderPreference){
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
     }

     const checkUser = await User.findOne({ email });

     if (checkUser)
       return res.json({
         success: false,
         message: "User already exists with the same email Please try with different email",
       });

     if (age < 18){
        return res.status(400).json({
            success: false,
            message: 'you must be atleast 18 year old'
        })
     }

     const newUser = await User.create({
        name,
        email,
        password,
        age,
        gender,
        genderPreference
     })

    const token = signToken(newUser._id)

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", 
    });

    res.status(201).json({
        success: true,
        user: newUser
    })

   }catch (e){
      console.log('Error is signup controller')
      res.status(500).json({
        success: false,
        message: "Server error"
      })
   }
}

export const login = async (req, res) => {

   const { email, password } = req.body

   try{

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    const user = await User.findOne({email}).select("+password");

    if (!user || (await user.matchPassword(password))){
        return res.status(401).json({
            success: false,
            message: 'invalid email or password'
        })
    }

    const token = signToken(user._id);

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", 
    });

    res.status(200).json({
        success: true,
        user
    })

   }catch (e){
    console.log('Error is login controller')
      res.status(500).json({
        success: false,
        message: "Server error"
      })
   }
}

export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "Logged out successffully"
  })
}

