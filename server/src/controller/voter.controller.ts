import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { getAndCreateUser } from "../models/user";
import customError from "../errors/customError";
import { Role } from "@prisma/client";
import { prisma } from "../models/db";

export const Voter = {
  addDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const email = req.body.email as string;
      const role = req.body.role as Role;
      const user_id = req.body.user_id as number;
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const phone_number = req.body.phone_number as number;
      const citizenship_url = req.file as Express.Multer.File;
      if (
        !email ||
        !role ||
        !user_id ||
        !name ||
        !address ||
        !citizen_number ||
        !phone_number ||
        !citizenship_url
      ) {
        return next(new customError("Internal Server Error", 404));
      }
      if (!req.body.user_id) {
        return next(new customError("Internal Server Error", 404));
      }
      const voter_id = req.user.user_id as unknown as number;

      const addDetails = await prisma.voter.create({
        data: {
          user_id: req.body?.user_id,
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
      const user_id = req.user.user_id as unknown as number;
      if (!user_id) {
        return next(new customError("Internal Server Error", 404));
      }
      const getDetails = await prisma.voter.findUnique({
        where: {
          user_id: user_id,
        },
        select: {
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
    }
  ),

  updateDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.user_id as number;
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const citizenship_photo_url = req.file as Express.Multer.File; // Access the uploaded file

      if (
        !user_id ||
        !name ||
        !address ||
        !citizen_number ||
        !citizenship_photo_url
      ) {
        throw new Error("Required fields not provided");
      }

      await prisma.$transaction([
        prisma.photo.updateMany({
          where: {
            voter_id: user_id,
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
            voter_id: user_id,
          },
        }),
        prisma.voter.update({
          where: {
            user_id: user_id,
          },
          data: {
            name,
            address,
            citizen_number,
          },
        }),
      ]);

      res.status(200).json({ message: "User details updated successfully" });
    }
  ),
};
