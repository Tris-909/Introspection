import express from "express";
import { param, body, checkSchema, checkExact } from "express-validator";
import { returnResponse } from "../utils";
import {
  createError,
  readError,
  patchError,
  deleteError,
} from "../controllers/error";
import {
  validate,
  createSchemaCheck,
  updateSchemaCheck,
  constructInvalidFormatErrorMsg,
} from "../validations";
import { Request, Response, NextFunction } from "express";
import { constructInvalidTypeErrorMsg } from "../validations";
import { ValidationCodes } from "../types";

export const errorRouter = express.Router();

errorRouter.post(
  "/",
  checkSchema(createSchemaCheck(), ["body"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const data = req.body;
      const error = await createError(data);

      res
        .status(201)
        .send(
          returnResponse(
            error,
            `Successfully created an error with ID ${error.id}`
          )
        );
    } catch (error) {
      res.locals.errors = error;
      next();
    }
  }
);

errorRouter.get(
  "/:id",
  param("id")
    .isUUID(4)
    .withMessage(
      constructInvalidFormatErrorMsg({ fieldName: "id", format: "uuid" })
    ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const errorID = req.params.id;
      const error = await readError(errorID);

      return res
        .status(200)
        .send(
          returnResponse(
            error,
            `Successfully fetched an error with ID ${errorID}`
          )
        );
    } catch (error) {
      res.locals.errors = error;
      next();
    }
  }
);

errorRouter.patch(
  "/:id",
  param("id")
    .isUUID(4)
    .withMessage(
      constructInvalidFormatErrorMsg({ fieldName: "id", format: "uuid" })
    ),
  body("title")
    .optional()
    .isString()
    .withMessage({
      code: ValidationCodes.INVALID_REQUEST_BODY,
      msg: constructInvalidTypeErrorMsg({
        fieldName: "title",
        type: "String",
      }),
    }),
  body("description")
    .optional()
    .isString()
    .withMessage({
      code: ValidationCodes.INVALID_REQUEST_BODY,
      msg: constructInvalidTypeErrorMsg({
        fieldName: "description",
        type: "String",
      }),
    }),
  body("description")
    .optional()
    .isArray()
    .withMessage({
      code: ValidationCodes.INVALID_REQUEST_BODY,
      msg: constructInvalidTypeErrorMsg({
        fieldName: "tags",
        type: "Array",
      }),
    }),
  checkExact([], {
    message: "Unknown fields spotted",
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const errorID = req.params.id;
      const data = req.body;

      const error = await patchError({ id: errorID, data: data });

      return res
        .status(200)
        .send(
          returnResponse(
            error,
            `Successfully updated an error with ID ${errorID}`
          )
        );
    } catch (error) {
      res.locals.errors = error;
      next();
    }
  }
);

errorRouter.delete(
  "/:id",
  param("id")
    .isUUID(4)
    .withMessage(
      constructInvalidFormatErrorMsg({ fieldName: "id", format: "uuid" })
    ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const errorID = req.params.id;
      await deleteError({ id: errorID });

      return res
        .status(200)
        .send(
          returnResponse({}, `Successfully deleted an error with ID ${errorID}`)
        );
    } catch (error) {
      res.locals.errors = error;
      next();
    }
  }
);
