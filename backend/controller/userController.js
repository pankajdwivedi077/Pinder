import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";


export const updateProfile = async (req, res) => {
    // image => cloudinary
    try{
      const { image, ...otherData } = req.body;

      let updatedData = otherData

      if(image){
        // base 64 format
        if(image.startsWith("data:image")){
            try{
               const uploadResponse = await cloudinary.uploader.upload(image)
               updatedData.image = uploadResponse.secure_url;
            }catch(e){
              console.log("error uploading image", e);
              return res.status(400).json({
                success: false,
                message: "Error uploading image."
              })
            }
        }
      }

      const updateduser = await User.findByIdAndUpdate(req.user.id, updatedData, {new: true})

      res.status(200).json({
        success: true,
        user: updateduser
      })

    }catch (e){
      console.log("error in updateProfile ", e);
      res.status(500).json({
        success: false,
        message: "internal server error"
      })
    }
}