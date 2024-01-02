import { validationResult } from "express-validator";

export const validate = (req) => {
  const result = validationResult(req);
  const returnErrorCodes = [];

  if (result.errors.length > 0) {
    for (let i = 0; i < result.errors.length; i++) {
      returnErrorCodes.push({
        code: result.errors[i].msg.code,
        message: result.errors[i].msg.msg,
      });
    }
  }

  if (returnErrorCodes.length > 0) {
    throw { statusCode: 400, errors: returnErrorCodes };
  }
};
