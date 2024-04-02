import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";

export const Voter = {
  addDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const citizenship_url = req.file as Express.Multer.File;

      if (!name || !address || !citizen_number || !citizenship_url) {
        return next(new customError("PRODIVE ALL DATA", 404));
      }
      if (!req.user.id) {
        return next(new customError("NO USER ID ", 404));
      }
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.id },
      });

      if (!user) {
        return next(new customError("PRODIVE ALL DATA", 404));
      }
      const addDetails = await prisma.voter.create({
        data: {
          user_id: req.user.id as number,
          name,
          address,
          citizen_number,
          photo: {
            create: {
              url: citizenship_url.path,
            },
          },
        },
      });
      res.status(200).json(addDetails);
    }
  ),

  getDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.id as unknown as number;
      if (!user_id) {
        return next(new customError("Internal Server Error", 404));
      }
      const getDetails = await prisma.voter.findUnique({
        where: {
          user_id: user_id,
        },
        select: {
          user_id: true,
          name: true,
          address: true,
          citizen_number: true,
          photo: {
            select: {
              url: true,
            },
          },
        },
      });
      res.status(200).json(getDetails);
      console.log(getDetails);
    }
  ),

  updateDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const citizenship_photo_url = req.file as Express.Multer.File; // Access the uploaded file

      if (!name || !address || !citizen_number || !citizenship_photo_url) {
        throw new Error("Required fields not provided");
      }

      const user = await prisma.user.findUnique({
        where: { user_id: req.user.id },
      });

      if (!user) {
        return next(new customError("PRODIVE ALL DATA", 404));
      }

      //if profile is already verified then return error
      const voter = await prisma.voter.findUnique({
        where: {
          user_id: user.user_id,
        },
      });
      if (!voter) {
        return next(new customError("Voter not found ", 404));
      }
      if (voter.is_verified) {
        return next(
          new customError(
            "Voter already verified,So not allowed to updated ",
            401
          )
        );
      }

      await prisma.$transaction([
        prisma.photo.updateMany({
          where: {
            user_id: user.user_id,
            isactive: true,
          },
          data: {
            isactive: false,
          },
        }),
        prisma.photo.create({
          data: {
            url: citizenship_photo_url.path,
            isactive: true,
            user_id: user.user_id,
          },
        }),
        prisma.voter.update({
          where: {
            user_id: user.user_id,
          },
          data: {
            name,
            address,
            citizen_number,
          },
        }),
      ]);

      res.status(200).json({ message: "Details updated successfully" });
    }
  ),
};
