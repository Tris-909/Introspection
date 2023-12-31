import express from "express";
import { createStubError } from "../databases/error.model.js";

export const errorRouter = express.Router();

errorRouter.post("/", async (req, res) => {
  const data = req.body;

  const error = await createStubError(data);

  res.send(error);
});
