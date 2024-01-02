import { universalValidationCodes } from "../validations/shared/universalCodes.js";

export const errorMiddleware = (error, req, res, next) => {
  if (Array.isArray(error?.errors)) {
    return res.status(error.statusCode).send({ errors: error.errors });
  }

  if (error) {
    return res.status(500).send({
      code: universalValidationCodes.INTERNAL_SERVER_ERROR,
      message: "Something went wrong, please try again",
    });
  }
};
