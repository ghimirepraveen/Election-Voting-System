import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { prisma } from "../models/db";

export const Admin = {
  getUsers: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const voterid = Number(req.params.voterid);

      const userProfile = await prisma.voter.findUnique({
        where: {
          voter_id: voterid,
        },
      });
      res.status(200).json({
        status: "success",
        message: "Admin route",
        profile: userProfile,
      });
    }
  ),
};
