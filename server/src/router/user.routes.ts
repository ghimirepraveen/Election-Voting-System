import express from "express";
import { User } from "../controller/user.controller";
import { verifyRole } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/reqpassword", User.reqPassword);
userRouter.post("/login", User.login);

export default userRouter;
