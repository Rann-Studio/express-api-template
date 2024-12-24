import { Request } from "express";

export type TUser = {
    id: string;
    email: string;
};

export type TRequest = Request & {
    user?: TUser | null;
};
