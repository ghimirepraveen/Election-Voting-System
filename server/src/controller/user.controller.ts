import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { getAndCreateUser } from "../models/user";
import jwt from "jsonwebtoken";
import { getUser } from "../utils/getuser";
import customError from "../errors/customError";
import bcrypt from "bcrypt";
import validateEmail from "../utils/verifyEmail";
import checkPasswordExpire from "../utils/checkPasswordExpires";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const User = {
  reqPassword: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const email = req.body.email;
      const role = req.body.role;
      validateEmail(email);
      getAndCreateUser(email, role);

      res.status(200).json({
        status: "success",
        message: "Password sent to email",
      });
    }
  ),

  login: asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email as string;
    const password = req.body.password as string;
    const role = req.body.role;
    if (!email || !password || !role)
      return next(new customError("Internal Server Error", 404));
    validateEmail(email);

    checkPasswordExpire(email);

    const user = await getUser(email, role);
    if (!user) throw new customError("User not found", 404);

    console.log(user);
    // const isMatch = await bcrypt.compare(
    //   password,
    //   user?.password_hash as string
    // );
    const isMatch = password === user?.password_hash;

    console.log(isMatch);

    if (!isMatch) throw new customError("Invalid credentials", 401);

    const token = jwt.sign(
      { id: user?.user_id, role: user?.role, email: user?.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    req.user = { id: user?.user_id, role: user?.role, email: user?.email };

    res.status(200).json({
      status: "success",
      token,
      data: req.user,
    });
  }),

  details: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.body.user;
      res.status(200).json({
        status: "success",
        user,
      });
    }
  ),
};
