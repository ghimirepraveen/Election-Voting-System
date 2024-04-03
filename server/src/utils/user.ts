import otpgenerator from "otp-generator";
import bcrypt from "bcrypt";
import { prisma } from "../models/db";
import { sendPasswordUsingMail } from "./sendPassword";
import { getUser } from "./getuser";
import { Role } from "@prisma/client";
import checkPasswordExpire from "./checkPasswordExpires";
async function generatePassword(): Promise<string> {
  const password: string = otpgenerator.generate(10, {
    digits: true,
    upperCaseAlphabets: true,
    specialChars: true,
  });
  console.log(`passport ${password}`);
  return password;
}

function passwordTime(): Date {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10); // OTP will expire in 1 minute
  return expirationTime;
}

// async function hashPassword(Password: string): Promise<string> {
//   const enOTP: string = await bcrypt.hash(Password, 10);
//   return enOTP;
// }

async function hashPassword(password: string): Promise<string> {
  const hashedPassword = password;
  return hashedPassword;
}

export async function getAndCreateUser(email: string, role: string) {
  try {
    const password = await generatePassword();

    const checkExpire = await checkPasswordExpire(email);
    const user = await getUser(email, role as Role);

    if (user && !checkExpire) {
      console.log("User exists and password expired");
      const hashedPassword = await hashPassword(password);
      const passwors_expires = passwordTime();
      console.log(passwors_expires);

      await prisma.user.update({
        where: { email: email },
        data: {
          password_hash: hashedPassword,
          passwors_expires: passwors_expires,
        },
      });

      await sendPasswordUsingMail(email, password);
    } else {
      if (!user) {
        const hashedPassword = await hashPassword(password);
        const passwors_expires = await passwordTime();
        await prisma.user.create({
          data: {
            email: email,
            password_hash: hashedPassword,
            passwors_expires: passwors_expires,
            role: role as Role,
          },
        });

        await sendPasswordUsingMail(email, password);
      }
    }
  } catch (error) {
    console.error("Error in getandCreateUser:", error);
    throw error;
  }
}
