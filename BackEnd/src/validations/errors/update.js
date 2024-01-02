import { constructInvalidTypeErrorMsg } from "../shared";
import { errorValidationCodes } from "./codes";

export const updateSchemaCheck = () => {
  return {
    title: {
      isString: {
        if: (value, { req }) => !!req.body.title,
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
      isString: {
        if: (value, { req }) => !!req.body.description,
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
      isArray: {
        if: (value, { req }) => !!req.body.tags,
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
