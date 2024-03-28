import express from "express";
import { Admin } from "../controller/admin.controler";
import { verifyRole } from "../middleware/auth";

const adminRouter = express.Router();

adminRouter.use(verifyRole(["ADMIN"]));
//VOTER ROUTES
adminRouter.get("/getvoter/:voterid", Admin.getVoter);
adminRouter.get("/getallvoters", Admin.getAllVoters);
adminRouter.get("/getallvotersnotverified", Admin.getAllvoterNotVerified);
adminRouter.patch("/verifyvoter/:voterid", Admin.verfiyVoter);
adminRouter.delete("/deletevoter/:voterid", Admin.deleteVoter);

//CANDIDATE ROUTES
adminRouter.get("/getcandidate/:candidateid", Admin.getCandidate);
adminRouter.get("/getallcandidates", Admin.getAllCandidates);
adminRouter.get(
  "/getallcandidatesnotverified",
  Admin.getAllCandidatesNotVerified
);
adminRouter.patch("/verifycandidate/:candidateid", Admin.verifyCandidate);
adminRouter.delete("/deletecandidate/:candidateid", Admin.deleteCandidate);
