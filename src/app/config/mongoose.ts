import mongoose from "mongoose";
import { DB_CONN_STRING } from "../helper/constant";

export const connectDB = async () => {
    try {
       await mongoose.connect(`${DB_CONN_STRING}`);
        console.log("Connect Success!"); 
    } catch (error) {
        console.log("Connect Failed!!!", error);
        
    }
}       