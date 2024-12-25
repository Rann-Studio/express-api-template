import { TUser } from "../types/express";
import { RequestException } from "../utils/error";
import { compareHash, createAccessToken, createHash, createRefreshToken } from "../utils/helper";
import { client } from "../utils/prisma";
import { SignInValue, SignUpValue } from "../utils/schema";

export const signIn = async (data: SignInValue) => {
    const user = await client.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new RequestException(401, "Invalid email or password");
    }

    const passwordMatch = compareHash(data.password, user.password);
    if (!passwordMatch) {
        throw new RequestException(401, "Invalid email or password");
    }

    const accessToken = createAccessToken({ id: user.id, email: user.email });
    const refreshToken = createRefreshToken({ id: user.id, email: user.email });

    await client.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };
};

export const signUp = async (data: SignUpValue) => {
    const existingEmail = await client.user.findUnique({
        where: { email: data.email },
    });

    if (existingEmail) {
        throw new RequestException(409, "Email already in use");
    }

    const hashedPassword = createHash(data.password);

    const user = await client.user.create({
        data: { email: data.email, password: hashedPassword },
    });

    const accessToken = createAccessToken({ id: user.id, email: user.email });
    const refreshToken = createRefreshToken({ id: user.id, email: user.email });

    await client.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };
};

export const refreshToken = async (user: TUser) => {
    const accessToken = createAccessToken({ id: user.id, email: user.email });
    const refreshToken = createRefreshToken({ id: user.id, email: user.email });

    await client.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };
};
