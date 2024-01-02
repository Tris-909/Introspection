import { validationResult } from "express-validator";
import { universalValidationCodes } from "./universalCodes";

export const validate = (req) => {
  const result = validationResult(req);
  const returnErrorCodes = [];

  if (result.errors.length > 0) {
    for (let i = 0; i < result.errors.length; i++) {
      const currentError = result.errors[i];

      if (currentError.type === universalValidationCodes.UNKNOWN_FIELDS) {
        currentError.fields.map((unknownField) => {
          const unknownFieldName = unknownField.path;
          const unknownFieldLocation = unknownField.location;

          returnErrorCodes.push({
            code: universalValidationCodes.UNKNOWN_FIELDS,
            message: `${unknownFieldName} field is an unknown fields inside the ${unknownFieldLocation} request`,
          });
        });
      } else {
        returnErrorCodes.push({
          code: currentError.msg.code,
          message: currentError.msg.msg,
        });
      }
    }
  }

  if (returnErrorCodes.length > 0) {
    throw { statusCode: 400, errors: returnErrorCodes };
  }
};
