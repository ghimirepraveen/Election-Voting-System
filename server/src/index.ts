import express from "express";

import errorHandeler from "./controller/error.contoller";
import userRouter from "./router/user.routes";
import voterRouter from "./router/voter.routes";
import adminRouter from "./router/admin.routes";
import candidateRouter from "./router/candidate.routes";
import electionRouter from "./router/election.routes";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use("/api/user", userRouter);

app.use("/api/voter", voterRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/admin", adminRouter);
app.use("/api/election", electionRouter);

app.use(errorHandeler);

app.listen(process.env.PORT, () => {
  console.log("\nGenerated Code!!! Please handel With Care!!\n");
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
