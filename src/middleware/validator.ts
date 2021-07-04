import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const validate = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (e) {
    return res.status(400).send({
      status: false,
      code: 400,
      message: "missing or empty request body",
      data: e.errors,
    });
  }
};

export default validate;
