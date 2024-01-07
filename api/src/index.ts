import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { errorRouter } from "routers/errorRouter";
import { errorMiddleware } from "middlewares/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

// Applying middlewares so that the app can works correctly
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Using routers
app.use("/error", errorRouter);

// Custom Error Middleware
app.use(errorMiddleware);

// Listen app on PORT to run the app
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
