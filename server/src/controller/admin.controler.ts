import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { prisma } from "../models/db";
import customError from "../errors/customError";
import { checkAdminMail } from "../utils/checkaAdminMail";
import {
  getDetails,
  getDetailsForVerified,
  getAllEntityNotVerified,
  getAllEntity,
  deleteEntity,
  verifyEntity,
} from "../models/admin";

export const adminController = (userType: "voter" | "candidate") => ({
  getdetails: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.voterid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }
      const email = req.user.email;

      // const checkAdmin = await checkAdminMail(email);

      // if (checkAdmin === false) {
      //   return next(new customError("You are not authorized", 404));
      // }
      const details = await getDetails(userType, id);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  getDetailsForVerified: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const details = await getDetailsForVerified(userType);
      const email = req.user.email;
      // const checkAdmin = await checkAdminMail(email);
      // if (checkAdmin === false) {
      //   return next(new customError("You are not authorized", 404));
      // }
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  getAllEntityNotVerified: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const email = req.user.email;
      // const checkAdmin = await checkAdminMail(email);
      // if (checkAdmin === false) {
      //   return next(new customError("You are not authorized", 404));
      // }
      const details = await getAllEntityNotVerified(userType);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),

  getAllEntity: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      // const email = req.user.email;
      // const checkAdmin = await checkAdminMail(email);
      // if (checkAdmin === false) {
      //   return next(new customError("You are not authorized", 404));
      // }
      const details = await getAllEntity(userType);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
  verifyEntity: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      // const email = req.user.email;
      // const checkAdmin = await checkAdminMail(email);
      // if (checkAdmin === false) {
      //   return next(new customError("You are not authorized", 404));
      // }
      const id = Number(req.params.voterid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }

      const details = await verifyEntity(userType, id);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),

  deleteEntity: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      // const email = req.user.email;
      // const checkAdmin = await checkAdminMail(email);
      // if (checkAdmin === false) {
      //   return next(new customError("You are not authorized", 404));
      // }
      const id = Number(req.params.voterid);
      if (!id) {
        return next(new customError("Provide ID", 404));
      }

      const details = await deleteEntity(userType, id);
      res.status(200).json({
        status: "success",
        details,
      });
    }
  ),
});
