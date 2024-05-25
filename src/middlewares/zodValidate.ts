import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        next();
    }
    catch(err: any) {
        throw new Error(`${err.errors[0].path[1]}: ${err.errors[0].message}`);
    }
}