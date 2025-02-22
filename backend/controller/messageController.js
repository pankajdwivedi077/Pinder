import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try{

   const { content, receiverId } = req.body;

   const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content
   })

   res.status(201).json({
    success: true,
    message: newMessage
   })

  }catch (e){
     console.log("error in sendMessage controller ", e);
     res.status(500).json({
        success: false,
        message: "Internal server error"
     })
  }
}

export const getConversion = async (req, res) => {
  const { userId } = req.params;
   try{
    const messages = await Message.find({
        $or: [
            {sender: req.user._id, receiver: userId},
            {sender: userId, receiver: req.user._id}
        ]
    }).sort("createdAt")

    res.status(200).json({
        success: true,
        messages
    })
   }catch(e){
     console.log("error in getconversions ", e)
     res.status(500).json({
        success: false,
        message: "internal server error"
     })
   }
}