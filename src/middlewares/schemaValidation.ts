import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const schemaValidation =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req);
      next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.reduce((acc, e) => {
          return (acc = { ...acc, [e.path[1]]: e.message });
        }, {} as { [key: string]: string });
      }
      return res.status(409).json({
        status: 'failed',
        error: err,
      });
    }
  };

export default schemaValidation;
