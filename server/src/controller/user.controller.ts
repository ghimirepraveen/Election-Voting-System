import { Request, Response, NextFunction } from "express";
import asyncCatch from "../errors/catchAsync";
import { getAndCreateUser } from "../utils/user";
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
      if (!email || !role)
        return next(new customError("Internal Server Error", 400));

      //checkeither role is among provided
      if (role !== "VOTER" && role !== "CANDIDATE")
        return next(new customError("Invalid role", 400));

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
    const getuser = await getUser(email, role);
    if (!getuser) {
      return next(new customError("User not found", 404));
    }

    if (getuser?.passwors_expires && getuser?.passwors_expires < new Date()) {
      return next(new customError("Password expired", 401));
    }

    const checkTime = checkPasswordExpire(email);

    if (!checkTime) throw new customError("Password expired", 401);

    const user = await getUser(email, role);
    if (!user) throw new customError("User not found", 404);
    // const isMatch = await bcrypt.compare(
    //   password,
    //   user?.password_hash as string
    // );

    const isMatch = password === user?.password_hash;
    if (!isMatch) throw new customError("Invalid credentials", 401);

    const token = jwt.sign(
      { id: user?.user_id, role: user?.role, email: user?.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    req.user = { id: user?.user_id, role: user?.role, email: user?.email };

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 50 * 1000,
      })
      .status(200)
      .json({
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
  logout: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      req.user = null;
      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    }
  ),
};

//hasssed password is not working here
