import express from "express";
import { adminController } from "../controller/admin.controler";
import { Election } from "../controller/election.controller";
import { verifyRole } from "../middleware/auth";
import { checkAdmin } from "../middleware/checkAdmin";
const adminRouter = express.Router();

adminRouter.use(verifyRole(["VOTER", "CANDIDATE"]));
adminRouter.use(checkAdmin);
//admin is verified by email provided in .env file
//adimin is checkted in checkAdminMail function in admin.controller.ts

//VOTER ROUTES
adminRouter.get(
  "/getvoter/:voterid",

  adminController("voter").getdetails
);

adminRouter.get(
  "/getallvotersverfied",
  adminController("voter").getDetailsForVerified
);
adminRouter.get(
  "/getallvotersnotverified",
  adminController("voter").getAllEntityNotVerified
);

adminRouter.get("/getallvoters", adminController("voter").getAllEntity);
adminRouter.patch(
  "/verifyvoter/:voterid",
  adminController("voter").verifyEntity
);
adminRouter.delete(
  "/deletevoter/:voterid",
  adminController("voter").deleteEntity
);
// //CANDIDATE ROUTES

adminRouter.get(
  "/getcandidate/:candidateid",
  adminController("candidate").getdetails
);
adminRouter.get(
  "/getallcandidatesverified",
  adminController("candidate").getDetailsForVerified
);
adminRouter.get(
  "/getallcandidatesnotverified",
  adminController("candidate").getAllEntityNotVerified
);
adminRouter.get("/getallcandidates", adminController("candidate").getAllEntity);
adminRouter.patch(
  "/verifycandidate/:candidateid",
  adminController("candidate").verifyEntity
);
adminRouter.delete(
  "/deletecandidate/:candidateid",
  adminController("candidate").deleteEntity
);

//election routes
adminRouter.post("/addelection", Election.addElection);
adminRouter.get("/getelection", Election.getAllElection);
adminRouter.get("/getelectionwitenddate", Election.getElectionBeforeEndDate);
adminRouter.put("/updateelection/:electionid", Election.updateElection);
adminRouter.delete("/deleteelection/:electionid", Election.deleteElection);
adminRouter.get("/getelection/:electionid", Election.getElectionById);
adminRouter.get("/getwinner/:electionid", Election.getWinner);
adminRouter.get(
  "/getelectionresult/:electionid",
  Election.getAllVoteCountOfElection
);

export default adminRouter;
