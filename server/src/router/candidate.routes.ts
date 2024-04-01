import express from "express";
import { verifyRole } from "../middleware/auth";
import { Candidate } from "../controller/candidate.controller";
import upload from "../config/multer/multer";
import { Candidancy } from "../controller/candidancy";
import { isVerifiedCandidate } from "../middleware/isverifed";
import { Vote } from "../controller/vote.controller";
import { Election } from "../controller/election.controller";

const candidateRouter = express.Router();

candidateRouter.use(verifyRole(["CANDIDATE"]));

candidateRouter.post(
  "/adddetails",
  upload.single("citizenshipCandidate"),
  Candidate.adddeatails
);

candidateRouter.get("/getdetails", Candidate.getDetails);
candidateRouter.put(
  "/updatedetails",
  upload.single("citizenshipCandidate"),
  Candidate.updateDetails
);

candidateRouter.delete("/deletedetails", Candidate.deleteCandidate);
candidateRouter.get(
  "/getelectionresult/:electionid",
  Election.getAllVoteCountOfElection
);
candidateRouter.get("/getwinner/:electionid", Election.getWinner);

//after this verfied  candidate can add candidancy

candidateRouter.use(isVerifiedCandidate);
candidateRouter.post("/addcandidancy/:electionid", Candidancy.addCandidancy);
candidateRouter.delete(
  "/deletecandidancy/:electionid",
  Candidancy.deleteCandidancy
);
candidateRouter.get(
  "/getelectioncandidancy/:electionid",
  Candidancy.getelectionCandidancy
);
candidateRouter.post("/addvote/:election_id/:candidate_id", Vote.addvote);

export default candidateRouter;
