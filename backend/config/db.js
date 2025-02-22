import mongoose from "mongoose";


export const connectDB = async () => {
    try{
      const conn = await mongoose.connect(process.env.MONGO_URI)
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch (e){
      console.log('error connecting to mongodb ', e)
      process.exit(1);
    }
}