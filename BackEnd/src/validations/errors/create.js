import {
  constructInvalidTypeErrorMsg,
  constructMissingFieldErrorMsg,
} from "../shared";
import { errorValidationCodes } from "./codes";

export const createSchemaCheck = () => {
  return {
    title: {
      exists: {
        options: true,
        errorMessage: {
          code: errorValidationCodes.INVALID_REQUEST_BODY,
          msg: constructMissingFieldErrorMsg({
            fieldName: "title",
            location: "body",
          }),
        },
      },
      isString: {
        options: true,
        errorMessage: {
          code: errorValidationCodes.INVALID_REQUEST_BODY,
          msg: constructInvalidTypeErrorMsg({
            fieldName: "title",
            type: "String",
          }),
        },
      },
    },
    description: {
      exists: {
        options: true,
        errorMessage: {
          code: errorValidationCodes.INVALID_REQUEST_BODY,
          msg: constructMissingFieldErrorMsg({
            fieldName: "description",
            location: "body",
          }),
        },
      },
      isString: {
        options: true,
        errorMessage: {
          code: errorValidationCodes.INVALID_REQUEST_BODY,
          msg: constructInvalidTypeErrorMsg({
            fieldName: "description",
            type: "String",
          }),
        },
      },
    },
    tags: {
      exists: {
        options: true,
        errorMessage: {
          code: errorValidationCodes.INVALID_REQUEST_BODY,
          msg: constructMissingFieldErrorMsg({
            fieldName: "tags",
            location: "body",
          }),
        },
      },
      isArray: {
        options: true,
        errorMessage: {
          code: errorValidationCodes.INVALID_REQUEST_BODY,
          msg: constructInvalidTypeErrorMsg({
            fieldName: "tags",
            location: "Array",
          }),
        },
      },
    },
  };
};
