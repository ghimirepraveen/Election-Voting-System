require("dotenv").config();
import { google } from "googleapis";
import nodemailer from "nodemailer";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const createTransporter = async () => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await new Promise((resolve, reject) => {
      oAuth2Client.getAccessToken((error, token) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      // @ts-ignore
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    return transporter;
  } catch (err) {
    throw err;
  }
};

export const sendPasswordUsingMail = async (
  email: string,
  Password: string
) => {
  const emailConfig = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "OTP Verification",
    html: `<h1></h1><h3><p>Your Password is: ${Password}</h3></p><p>Expiring in 1 Minutes....</p>`,
  };

  try {
    const mailTransporter = await createTransporter();

    await mailTransporter.sendMail(emailConfig);
    return {
      status: 200,
      message: `OTP has been sent to your email.`,
    };
  } catch (error) {
    console.log(`Transporter : ${error} `);
    return {
      status: 500,
      message: "Failed to send OTP via email.",
    };
  }
};
