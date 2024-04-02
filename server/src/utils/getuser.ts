import { Role } from "@prisma/client";
import { prisma } from "../models/db";

export async function getUser(email: string, role: Role) {
  console.log(email, role);
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
  console.log(user);

  return user;
}
