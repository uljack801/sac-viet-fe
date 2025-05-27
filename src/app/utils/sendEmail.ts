import nodemailer from "nodemailer";
import { google } from "googleapis";
import { CLIENT_ID, CLIENT_SECRET, EMAIL_ADMIN, REFRESH_TOKEN } from "../helper/constant";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

export default async function sendEmail(to: string, subject: string, text: string) {
    try {
        const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL_ADMIN,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token!,
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
