import mongoose from "mongoose";
import "dotenv/config";
const db_URI = process.env.MONGO_URI;
const connectDB = async () => {   
    try{
        console.log("Connecting to database");
     await mongoose.connect(db_URI);
       console.log("Connected to database");
    } catch (error){
        console.log("Error connecting to database")
    }
};

export default connectDB;