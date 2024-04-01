import express from "express";
import { verifyRole } from "../middleware/auth";
import { Voter } from "../controller/voter.controller";
import upload from "../config/multer/multer";
import { isVerifiedVoter } from "../middleware/isverifed";
import { Vote } from "../controller/vote.controller";

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

voterRouter.use(isVerifiedVoter);
voterRouter.post("/vote/:electionid", Vote.addvote);

export default voterRouter;
