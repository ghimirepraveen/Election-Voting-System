import { Request, Response, NextFunction } from "express";
import customError from "../errors/customError";
import { prisma } from "../models/db";

export const isVerifiedVoter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user.id;
  const voter = await prisma.voter.findFirst({
    where: {
      user_id: id,
    },
  });
  const isVerified = voter?.is_verified;

  if (!isVerified) {
    return next(new customError("You are not authorized", 403));
  }
  next();
};

export const isVerifiedCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user.id;
  const candidate = await prisma.candidate.findFirst({
    where: {
      user_id: id,
    },
  });
  const isVerified = candidate?.is_verified;

  if (!isVerified) {
    return next(new customError("You are not authorized", 403));
  }
  next();
};
