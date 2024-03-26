import express from "express";
import { User } from "../controller/usercontroller";
import { verifyRole } from "../middleware/auth";
import { Voter } from "../controller/voter.controller";
import upload from "../config/multer/multer";

const voterRouter = express.Router();

voterRouter.post(
  "/addDetails",
  upload.single("citizenship"),
  verifyRole(["VOTER"]),
  Voter.addDetails
);
voterRouter.get("/getDetails", verifyRole(["VOTER"]), Voter.getDetails);
