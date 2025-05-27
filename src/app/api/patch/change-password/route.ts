import User from "@/app/config/models/User";
import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {    
    const authHeader = req.headers.get('authorization')
    try {
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return NextResponse.json({
                message: "Unauthorization"
            },{status: 401})
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, SECRET_KEY) as {email: string}
        if(!decoded){
            return NextResponse.json({
                message: "Unauthorization"
            },{status: 401})
        }
        const {password} = await req.json();
        const findUser = await User.findOne({email : decoded.email})

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

        findUser.password = password
        await findUser.save();

        return NextResponse.json({
            message: "Update Password Success!"
        }, { status: 200 });

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