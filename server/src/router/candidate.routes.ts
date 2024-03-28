import express from "express";
import { verifyRole } from "../middleware/auth";
import { Candidate } from "../controller/candidate.controller";
import upload from "../config/multer/multer";

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

export default candidateRouter;
