import { prisma } from "../models/db";

export default async function checkPasswordExpire(email: string) {
  try {
    const [user] = await prisma.user
      .findMany({
        where: { email: email },
      })
      .catch((err: Error) => {
        throw err;
      });

    const NotExpired =
      user?.passwors_expires &&
      user?.passwors_expires?.getTime() - new Date().getTime() > 0;
    return NotExpired;
  } catch (error) {
    throw error;
  }
}
