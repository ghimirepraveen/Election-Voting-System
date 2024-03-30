import { PrismaClient } from "@prisma/client";
import { prisma } from "../models/db";

const modelMap: Record<"voter" | "candidate", any> = {
  voter: prisma.voter,
  candidate: prisma.candidate,
};

export async function getDetails(userType: "voter" | "candidate", id: number) {
  {
    const details = await modelMap[userType].findUnique({
      where: {
        user_id: id,
      },
    });
    return details;
  }
}

export async function getDetailsForVerified(userType: "voter" | "candidate") {
  const details = await modelMap[userType].findUnique({
    where: {
      is_verified: true,
    },
  });
  return details;
}

export async function getAllEntityNotVerified(userType: "voter" | "candidate") {
  const details = await modelMap[userType].findMany({
    where: {
      is_verified: false,
    },
  });
  return details;
}

export async function getAllEntity(userType: "voter" | "candidate") {
  const details = await modelMap[userType].findMany();
  return details;
}

export async function deleteEntity(
  userType: "voter" | "candidate",
  id: number
) {
  const entity = await modelMap[userType].findUnique({
    where: {
      user_id: id,
    },
  });

  if (!entity) {
    throw new Error("Entity not found");
  }

  await modelMap[userType].delete({
    where: {
      user_id: id,
    },
  });

  return entity;
}

export async function verifyEntity(
  userType: "voter" | "candidate",
  id: number
) {
  const entity = await modelMap[userType].findUnique({
    where: {
      user_id: id,
    },
  });

  if (!entity) {
    throw new Error("Entity not found");
  }

  const entityverfied = await modelMap[userType].findUnique({
    where: {
      user_id: id,
      is_verified: true,
    },
  });
  if (entityverfied) {
    throw new Error("Entity already verified");
  }

  await modelMap[userType].update({
    where: {
      user_id: id,
    },
    data: {
      is_verified: true,
    },
  });

  return entity;
}
