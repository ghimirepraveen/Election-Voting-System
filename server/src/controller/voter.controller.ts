// Importing necessary modules and functions
import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import customError from "../errors/customError";
import { prisma } from "../models/db";

// Exporting an object with methods `addDetails`, `getDetails`, and `updateDetails`
export const Voter = {
  // `addDetails` is an asynchronous function wrapped in a higher-order function `asyncCatch`
  // that catches any errors and passes them to the next middleware
  addDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      // Extracting data from the request body
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const citizenship_url = req.file as Express.Multer.File;

      // Checking if all required data is provided
      if (!name || !address || !citizen_number || !citizenship_url) {
        // If not, return an error with status code 404
        return next(new customError("PROVIDE ALL DATA", 404));
      }
      // Checking if user ID is provided
      if (!req.user.id) {
        // If not, return an error with status code 404
        return next(new customError("NO USER ID ", 404));
      }
      // Finding a user with the provided ID
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.id },
      });
      // Checking if a voter with the provided citizen number already exists
      const checkCitizen = await prisma.voter.findUnique({
        where: {
          citizen_number,
        },
      });

      // If a voter with the provided citizen number already exists, return an error with status code 403
      if (checkCitizen)
        return next(new customError("Citizen number already exists", 403));

      // If the user does not exist, return an error with status code 404
      if (!user) {
        return next(new customError("PROVIDE ALL DATA", 404));
      }
      // Creating a new voter with the provided data
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
      // Sending the created voter as a response with status code 200
      res.status(200).json(addDetails);
    }
  ),

  // `getDetails` is an asynchronous function wrapped in a higher-order function `asyncCatch`
  // that catches any errors and passes them to the next middleware
  getDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      // Extracting user ID from the request
      const user_id = req.user.id as unknown as number;
      // If user ID is not provided, return an error with status code 404
      if (!user_id) {
        return next(new customError("Internal Server Error", 404));
      }
      // Finding a voter with the provided user ID
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
      // Sending the found voter as a response with status code 200
      res.status(200).json(getDetails);
    }
  ),

  // `updateDetails` is an asynchronous function wrapped in a higher-order function `asyncCatch`
  // that catches any errors and passes them to the next middleware
  updateDetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      // Extracting data from the request body
      const name = req.body.name as string;
      const address = req.body.address as string;
      const citizen_number = req.body.citizen_number as string;
      const citizenship_photo_url = req.file as Express.Multer.File; // Access the uploaded file

      // Checking if all required data is provided
      if (!name || !address || !citizen_number || !citizenship_photo_url) {
        throw new Error("Required fields not provided");
      }

      // Finding a user with the provided ID
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.id },
      });

      // If the user does not exist, return an error with status code 404
      if (!user) {
        return next(new customError("PROVIDE ALL DATA", 404));
      }

      // Finding a voter with the provided user ID
      const voter = await prisma.voter.findUnique({
        where: {
          user_id: user.user_id,
        },
      });
      // If the voter does not exist, return an error with status code 404
      if (!voter) {
        return next(new customError("Voter not found ", 404));
      }
      // If the voter is already verified, return an error with status code 401
      if (voter.is_verified) {
        return next(
          new customError(
            "Voter already verified,So not allowed to updated ",
            401
          )
        );
      }

      // Updating the voter's details and the photo
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

      // Sending a success message as a response with status code 200
      res.status(200).json({ message: "Details updated successfully" });
    }
  ),
};
