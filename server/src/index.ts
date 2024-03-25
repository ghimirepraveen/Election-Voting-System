import express from "express";

import errorHandeler from "./controller/error.contoller";
import userRouter from "./router/user.routes";

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);

app.use(errorHandeler);
app.listen(process.env.PORT, () => {
  console.log("\nGenerated Code!!! Please handel With Care!!\n");
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
