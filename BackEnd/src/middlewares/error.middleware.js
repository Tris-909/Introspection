import { universalValidationCodes } from "../validations/shared/universalCodes.js";

export const errorMiddleware = (error, req, res, next) => {
  if (error) {
    return res.status(500).send({
      code: universalValidationCodes.INTERNAL_SERVER_ERROR,
      message: "Something went wrong, please try again",
    });
  }
};
