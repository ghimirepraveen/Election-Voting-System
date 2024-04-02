import express from "express";
import { Election } from "../controller/election.controller";

const electionRouter = express.Router();

electionRouter.get("/getallelections", Election.getAllElection);
electionRouter.get(
  "/getelectionallvote/:electionid",
  Election.getAllVoteCountOfElection
);
electionRouter.get("/getwinner/:electionid", Election.getWinner);

export default electionRouter;
