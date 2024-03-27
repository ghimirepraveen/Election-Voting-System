import express from "express";
import { User } from "../controller/usercontroller";
import { verifyRole } from "../middleware/auth";

const adminRouter = express.Router();

adminRouter.use(verifyRole(["ADMIN"]));

adminRouter.get("/getusers/:voterid ");
