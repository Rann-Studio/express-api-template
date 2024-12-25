import { NextFunction, Response } from "express";
import { TRequest } from "../types/express";
import { RequestException } from "../utils/error";
import { handleError, verifyAccessToken, verifyRefreshToken } from "../utils/helper";
import { client } from "../utils/prisma";

export const checkAccessToken = async (req: TRequest, res: Response, next: NextFunction) => {
    try {
        const tokenHeader = req.headers["authorization"];

        if (!tokenHeader) {
            return next(new RequestException(401, "Token not found"));
        }

        const [scheme, token] = tokenHeader.split(" ");
        if (scheme !== "accessToken" || !token) {
            return next(new RequestException(401, "Invalid token format"));
        }

        const decoded = verifyAccessToken(token);

        const user = await client.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true },
        });

        req.user = user;
    } catch (error) {
        handleError(error, next);
    }
};

export const checkRefreshToken = async (req: TRequest, res: Response, next: NextFunction) => {
    try {
        const tokenHeader = req.headers["authorization"];

        if (!tokenHeader) {
            return next(new RequestException(401, "Token not found"));
        }

        const [scheme, token] = tokenHeader.split(" ");
        if (scheme !== "refreshToken" || !token) {
            return next(new RequestException(401, "Invalid token format"));
        }

        const decoded = verifyRefreshToken(token);

        const user = await client.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true },
        });

        req.user = user;
        next();
    } catch (error) {
        handleError(error, next);
    }
};
