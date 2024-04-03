import { Role } from "@prisma/client";
import { prisma } from "../models/db";

export async function getUser(email: string, role: Role) {
  const user = await prisma.user
    .findFirst({
      where: {
        email,
        role,
      },
    })
    .catch((err: Error) => {
      throw err;
    });
  return user;
}
