import {
  constructInvalidTypeErrorMsg,
  constructMissingFieldErrorMsg,
} from "../";
import { ValidationCodes } from "../../types";
import { Schema } from "express-validator";

//TODO: WORK THIS SHIT OUT
export const createSchemaCheck = (): Schema => {
  return {
    title: {
      exists: {
        errorMessage: {
          code: ValidationCodes.INVALID_REQUEST_BODY,
          msg: constructMissingFieldErrorMsg({
            fieldName: "title",
            location: "body",
          }),
        },
      },
      isString: {
        errorMessage: {
          code: ValidationCodes.INVALID_REQUEST_BODY,
          msg: constructInvalidTypeErrorMsg({
            fieldName: "title",
            type: "String",
          }),
        },
      },
    },
    description: {
      exists: {
        errorMessage: {
          code: ValidationCodes.INVALID_REQUEST_BODY,
          msg: constructMissingFieldErrorMsg({
            fieldName: "description",
            location: "body",
          }),
        },
      },
      isString: {
        errorMessage: {
          code: ValidationCodes.INVALID_REQUEST_BODY,
          msg: constructInvalidTypeErrorMsg({
            fieldName: "description",
            type: "String",
          }),
        },
      },
    },
    tags: {
      exists: {
        errorMessage: {
          code: ValidationCodes.INVALID_REQUEST_BODY,
          msg: constructMissingFieldErrorMsg({
            fieldName: "tags",
            location: "body",
          }),
        },
      },
      isArray: {
        errorMessage: {
          code: ValidationCodes.INVALID_REQUEST_BODY,
          msg: constructInvalidTypeErrorMsg({
            fieldName: "tags",
            type: "Array",
          }),
        },
      },
    },
  };
};
