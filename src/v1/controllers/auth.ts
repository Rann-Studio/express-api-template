import { NextFunction, Request, Response } from "express";
import * as authService from "../../v1/services/auth";
import { TRequest } from "../types/express";
import { createResponse, handleError, handleValidation } from "../utils/helper";
import * as validator from "../utils/schema";
import { RequestException } from "../utils/error";

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parse = validator.signInSchema.safeParse(req.body);
        handleValidation(parse, res);

        const result = await authService.signIn(req.body);
        const response = createResponse(200, "Sign in success", result);
        res.status(response.statusCode).json(response);
    } catch (error) {
        handleError(error, next);
    }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parse = validator.signUpSchema.safeParse(req.body);
        handleValidation(parse, res);

        const result = await authService.signUp(req.body);
        const response = createResponse(201, "Sign up success", result);
        res.status(response.statusCode).json(response);
    } catch (error) {
        handleError(error, next);
    }
};

export const refreshToken = async (req: TRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return next(new RequestException(401, "User not found"));

        const result = await authService.refreshToken(req.user);
        const response = createResponse(200, "Refresh token success", result);
        res.status(response.statusCode).json(response);
    } catch (error) {
        handleError(error, next);
    }
};
