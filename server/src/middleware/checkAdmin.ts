import { Request, Response, NextFunction } from "express";
import customError from "../errors/customError";
import { checkAdminMail } from "../utils/checkaAdminMail";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.user.email;
  const isAdmin: boolean = await checkAdminMail(email);
  if (!isAdmin) {
    return next(new customError("You are not authorized", 403));
  }
  next();
};
