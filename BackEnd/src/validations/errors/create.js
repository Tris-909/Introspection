import { errorValidationCodes } from "./codes.js";
import { validationResult } from "express-validator";

export const validateCreateError = (req) => {
  const result = validationResult(req);
  const returnErrorCodes = [];

  if (result.errors.length > 0) {
    for (let i = 0; i < result.errors.length; i++) {
      returnErrorCodes.push({
        code: errorValidationCodes.INVALID_REQUEST_BODY,
        message: result.errors[i].msg,
      });
    }
  }

  if (returnErrorCodes.length > 0) {
    throw {
      statusCode: 400,
      errors: returnErrorCodes,
    };
  }
};
