import { SECRET_KEY } from "@/app/helper/constant";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value || req.headers.get("refreshToken");
    
        if(!refreshToken){
            return NextResponse.json({
                message: 'Missing refresh token'
            }, {status: 401})
        }

        const decoded = jwt.verify(refreshToken , SECRET_KEY) as {id: string , account: string , email: string, role: string[]}

        const accessToken = jwt.sign({id: decoded.id , account: decoded.account ,email: decoded.email , role: decoded.role} , SECRET_KEY , { expiresIn: '15m'})
        return NextResponse.json({
            accessToken,
            message: 'Success'
        }, {status: 200, statusText: "Success"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({
             message: "Internal server error"
        }, {status: 500})
    }
}