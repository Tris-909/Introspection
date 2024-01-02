import express from "express";
import { param, checkSchema } from "express-validator";
import { returnResponse } from "../utils";
import { createError, readError } from "../controllers/error";
import { validateReadError, validateCreateError } from "../validations/errors";

export const errorRouter = express.Router();

errorRouter.post(
  "/",
  checkSchema(
    {
      title: {
        exists: {
          options: true,
          errorMessage: "title is required in the body",
        },
        isString: {
          options: true,
          errorMessage: "title type required to be STRING",
        },
      },
      description: {
        exists: {
          options: true,
          errorMessage: "description is required in the body",
        },
        isString: {
          options: true,
          errorMessage: "description type required to be STRING",
        },
      },
      tags: {
        exists: {
          options: true,
          errorMessage: "tags is required in the body",
        },
        isArray: {
          options: true,
          errorMessage: "description type required to be ARRAY",
        },
      },
    },
    ["body"]
  ),
  async (req, res, next) => {
    try {
      validateCreateError(req);
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
  param("id").isUUID(4).withMessage("id provided is not a valid uuid"),
  async (req, res, next) => {
    try {
      validateReadError(req);
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
