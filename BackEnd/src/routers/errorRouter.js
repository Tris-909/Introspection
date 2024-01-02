import express from "express";
import { param, checkSchema, checkExact } from "express-validator";
import { returnResponse } from "../utils";
import {
  createError,
  readError,
  patchError,
  deleteError,
} from "../controllers/error";
import { createSchemaCheck, updateSchemaCheck } from "../validations/errors";
import { validate } from "../validations";
import { constructInvalidFormatErrorMsg } from "../validations/shared";

export const errorRouter = express.Router();

errorRouter.post(
  "/",
  checkSchema(createSchemaCheck(), ["body"]),
  async (req, res, next) => {
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
      if (Array.isArray(error?.errors)) {
        return res.status(error.statusCode).send({ errors: error.errors });
      }

      next(error);
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
  async (req, res, next) => {
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
      if (Array.isArray(error?.errors)) {
        return res.status(error.statusCode).send({ errors: error.errors });
      }

      next(error);
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
  checkExact(checkSchema(updateSchemaCheck(), ["body"])),
  async (req, res, next) => {
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
      if (Array.isArray(error?.errors)) {
        return res.status(error.statusCode).send({ errors: error.errors });
      }

      next(error);
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
  async (req, res, next) => {
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
      if (Array.isArray(error?.errors)) {
        return res.status(error.statusCode).send({ errors: error.errors });
      }

      next(error);
    }
  }
);
