import { ZodError } from "zod";
import { Response } from "express";

export function handleValidationError(res: Response, error: ZodError) {
    return res.status(400).json({
        errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }))
    });
}