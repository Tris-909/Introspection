import { validationResult } from "express-validator";
import { ValidationCodes } from "types";
import { Request } from "express";

export const validate = (req: Request) => {
  const result = validationResult(req);
  const errors = result.array();
  const returnErrorCodes = [];

  if (errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
      const currentError = errors[i];

      if (currentError.type === ValidationCodes.UNKNOWN_FIELDS) {
        currentError.fields.map((unknownField) => {
          const unknownFieldName = unknownField.path;
          const unknownFieldLocation = unknownField.location;

          returnErrorCodes.push({
            code: ValidationCodes.UNKNOWN_FIELDS,
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
