import { constructInvalidTypeErrorMsg } from "../";
import { ValidationCodes } from "../../types";
import { Request } from "express";

export const updateSchemaCheck = () => {
  return {
    title: {
      isString: {
        if: (_: string, { req }: { req: Request }) => !!req.body.title,
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
      isString: {
        if: (_: string, { req }: { req: Request }) => !!req.body.description,
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
      isArray: {
        if: (_: string, { req }: { req: Request }) => !!req.body.tags,
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
