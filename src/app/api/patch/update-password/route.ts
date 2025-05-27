import User from "@/app/config/models/User";
import { NextRequest, NextResponse } from "next/server";
import  jwt from "jsonwebtoken";
import { SECRET_KEY } from "@/app/helper/constant";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }  
        
        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token , SECRET_KEY) as {id: string, email: string , account: string}

        const {password , newPassword} = await req.json();
        if (decoded) {
        const findUser = await User.findOne({_id: decoded.id}).select('password')

        if(!findUser){
            return NextResponse.json({
                message: "Not Found account!"
            },{status: 404})
        }
        if(!password){
            return NextResponse.json({
                message: "Password not null!"
            },{status: 400}) 
        }
        const isMatch = await bcrypt.compare(password, findUser.password);

        if(!isMatch){
            return NextResponse.json({
                message: "Password not correct!"
            },{status: 401}) 
        }
        findUser.password = newPassword
        await findUser.save();

        return NextResponse.json({
            message: "Update Password Success!"
        }, { status: 200 });
    }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Internal Server Error"
            },
            { status: 500 }
        );
    }
    
}