import { Request, Response, NextFunction } from "express";
import { prisma } from "../models/db";
import customError from "../errors/customError";
import asyncCatch from "../errors/catchAsync";

export const Candidate = {
  adddeatails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const position = req.body.position as string;
      const manifesto = req.body.manifesto as string;
      const citizenship_url = req.file as Express.Multer.File;

      if (!name || !address || !citizen_number || !position) {
        return next(new customError("PROVIDE ALL DATA", 404));
      }
      if (!req.user.id) {
        return next(new customError("NO USER ID", 404));
      }
      const user_id = req.user.id as unknown as number;

      //check either their is already candidate with same user_id
      const checkCandidate = await prisma.candidate.findUnique({
        where: {
          user_id,
        },
      });
      if (checkCandidate)
        return next(new customError("Candidate already exists", 403));

      const adddeatails = await prisma.candidate.create({
        data: {
          user_id,
          name,
          address,
          citizen_number,
          position,
          manifesto,

          photo: {
            create: {
              url: citizenship_url.path,
            },
          },
        },
      });

      res.status(201).json(adddeatails);
    }
  ),
  getDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.id as unknown as number;
      if (!user_id) {
        return next(new customError("Internal Server Error", 404));
      }
      const getDetails = await prisma.candidate.findUnique({
        where: {
          user_id: user_id,
        },
        select: {
          name: true,
          address: true,
          citizen_number: true,
          position: true,
          manifesto: true,
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
      const user_id = req.user.id as number;
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const position = req.body.position as string;
      const manifesto = req.body.manifesto as string;
      const citizenship_photo_url = req.file as Express.Multer.File;

      if (
        !user_id ||
        !name ||
        !address ||
        !citizen_number ||
        !position ||
        !citizenship_photo_url ||
        !manifesto
      ) {
        throw new Error("Required fields not provided");
      }

      const findCandidate = await prisma.candidate.findUnique({
        where: {
          user_id,
        },
      });

      if (!findCandidate)
        return next(new customError("Candidate not found ", 404));
      if (findCandidate.is_verified)
        return next(
          new customError(
            "Your account is verified So not allowed to update ",
            401
          )
        );

      await prisma.$transaction([
        prisma.photo.updateMany({
          where: {
            user_id,
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
            user_id,
          },
        }),
        prisma.candidate.update({
          where: {
            user_id: user_id,
          },
          data: {
            name,
            address,
            citizen_number,
            position,
            manifesto,
          },
        }),
      ]);

      res
        .status(200)
        .json({ message: "Candidate details updated successfully" });
    }
  ),
  deleteCandidate: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.user.id as number;
      if (!user_id) {
        return next(new customError("Internal Server Error", 404));
      }
      const candidate = await prisma.candidate.findUnique({
        where: {
          user_id: user_id,
        },
      });

      if (!candidate) next(new customError("Candidate not found", 404));
      await prisma.candidate.delete({
        where: {
          user_id: user_id,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Candidate found",
        candidate,
      });
    }
  ),
};
