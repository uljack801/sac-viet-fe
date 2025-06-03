import mongoose from "mongoose";
import { DB_CONN_STRING } from "../helper/constant";


let isConnected = false; 

export const connectDB = async () => {
    if (isConnected) return;
    try {
       await mongoose.connect(`${DB_CONN_STRING}`);
        console.log("Connect Success!"); 
        isConnected = true;
    } catch (error) {
        console.log("Connect Failed!!!", error);
        
    }
}       