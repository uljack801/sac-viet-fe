import nodemailer from "nodemailer";
import { CLIENT_ID, CLIENT_SECRET, EMAIL_ADMIN, REFRESH_TOKEN } from "../helper/constant";

export default async function sendEmail(to: string, subject: string, text: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL_ADMIN,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
            },
        });

        const mailOptions = {
            from: EMAIL_ADMIN,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
