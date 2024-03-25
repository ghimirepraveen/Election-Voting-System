import express from "express";
import { User } from "../controller/usercontroller";
import { verifyRole } from "../middleware/auth";
import { Voter } from "../controller/voter.controller";

const voterRouter = express.Router();

voterRouter.post("/addDetails", verifyRole(["VOTER"]), Voter.addDetails);
voterRouter.get("/getDetails", verifyRole(["VOTER"]), Voter.getDetails);
