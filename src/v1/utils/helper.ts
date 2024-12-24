import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ZodError, ZodIssue } from "zod";
import { NextFunction, Response } from "express";
import { AppError, RequestException } from "./error";

export const normalizePort = (port: string | number): number => {
    const normalizedPort = Number(port);
    if (isNaN(normalizedPort)) {
        return 3001;
    }
    return normalizedPort;
};

export const normalizeBoolean = (value: string | boolean | number | undefined): boolean => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        const normalizedString = value.toLowerCase();
        return ["true", "1"].includes(normalizedString);
    }

    if (typeof value === "number") {
        return value === 1;
    }

    return false;
};

export const createResponse = (statusCode: number, message: string, data?: Record<string, any>, error?: Record<string, any>, stack?: string) => {
    return {
        statusCode,
        message,
        ...(data && { data }),
        ...(error && { error }),
        ...(process.env.NODE_ENV === "development" && stack && { stack }),
    };
};

export const createHash = (data: string): string => {
    return bcrypt.hashSync(data, parseInt(process.env.BCRYPT_SALT_ROUND || "12", 10));
};

export const compareHash = (data: string, hash: string): boolean => {
    return bcrypt.compareSync(data, hash);
};

export const createAccessToken = (payload: Record<string, any>): string => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "SUPER_SECRET_ACCESS_TOKEN", {
        expiresIn: process.env.ACCESS_TOKEN_VALID_TIME || "2m",
    });
};

export const verifyAccessToken = (token: string): Record<string, any> => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "SUPER_SECRET_ACCESS_TOKEN") as Record<string, any>;
    } catch (error) {
        throw error;
    }
};

export const createRefreshToken = (payload: Record<string, any>): string => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || "SUPER_SECRET_REFRESH_TOKEN", {
        expiresIn: process.env.REFRESH_TOKEN_VALID_TIME || "1d",
    });
};

export const verifyRefreshToken = (token: string): Record<string, any> => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "SUPER_SECRET_REFRESH_TOKEN") as Record<string, any>;
    } catch (error) {
        throw error;
    }
};

export const formatZodError = (error: ZodError): Array<{ path: string[]; messages: string[] }> => {
    const groupedErrors = error.issues.reduce((acc, issue: ZodIssue) => {
        const pathKey = issue.path.join(".");
        if (!acc[pathKey]) {
            acc[pathKey] = [];
        }
        acc[pathKey].push(issue.message);
        return acc;
    }, {} as Record<string, string[]>);

    return Object.keys(groupedErrors).map((key) => ({
        path: key.split("."),
        messages: groupedErrors[key],
    }));
};

export const handleValidation = (parse: any, res: Response) => {
    if (!parse.success) {
        const error = formatZodError(parse.error);
        const response = createResponse(400, "Validation error", undefined, error);
        return res.status(response.statusCode).json(response);
    }
};

export const handleError = (error: any, next: NextFunction) => {
    if (error instanceof AppError || error instanceof RequestException) {
        next(error);
    } else if (error instanceof jwt.TokenExpiredError) {
        next(new RequestException(401, "Token has expired"));
    } else if (error instanceof jwt.JsonWebTokenError) {
        next(new RequestException(401, "Invalid token"));
    } else {
        next(new AppError(error, 500, "Internal Server Error"));
    }
};
