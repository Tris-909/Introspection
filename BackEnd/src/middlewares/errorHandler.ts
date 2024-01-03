import { NextFunction, Request, Response } from "express";
import { ExpressErrors, ValidationCodes } from "../types";

export const errorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customErrors = res.locals?.errors?.errors;
  const customErrorStatusCode = res.locals?.errors?.statusCode;

  if (Array.isArray(customErrors)) {
    return res.status(customErrorStatusCode).send({ errors: customErrors });
  }

  return res.status(500).send({
    code: ValidationCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong, please try again",
  });
};
