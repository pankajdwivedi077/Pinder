import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try{

    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Not authorized - No Token Provided"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({
            success: false,
            message: "invalid token"
        })
    }

    const currentUser = User.findById(decoded.id);

    req.user = currentUser;

    next();

  }catch (e){
     console.log("error in auth middleware ", e);
     if(e instanceof jwt.JsonWebTokenError){
        return res.status(401).json({
            success: false,
            message: "Not authorized -invalid token"
        })
     }else{
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
     }
  }
}