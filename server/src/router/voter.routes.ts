import express from "express";
import { User } from "../controller/usercontroller";
import { verifyRole } from "../middleware/auth";
import { Voter } from "../controller/voter.controller";
import upload from "../config/multer/multer";

const voterRouter = express.Router();

voterRouter.use(verifyRole(["VOTER"]));

voterRouter.post(
  "/adddetails",
  upload.single("citizenshipVoter"),
  Voter.addDetails
);
voterRouter.get("/getdetails", Voter.getDetails);

voterRouter.put(
  "/updatedetails",
  upload.single("citizenship"),
  Voter.updateDetails
);

export default voterRouter;
