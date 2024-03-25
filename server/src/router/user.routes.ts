import express from "express";
import { User } from "../controller/usercontroller";
import { verifyRole } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/reqpassword", User.reqPassword);
userRouter.post("/login", User.login);

userRouter.get("/detail", verifyRole(["ADMIN"]), User.details);

export default userRouter;
