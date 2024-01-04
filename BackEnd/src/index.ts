import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { errorRouter } from "routers/errorRouter";
import { errorMiddleware } from "middlewares/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/error", errorRouter);

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
