import request from "supertest";
import { server } from "../../../index";

describe("Auth Refresh Token", () => {
    it("should return a successful response with valid credentials", async () => {
        const response = await request(server).post("/api/v1/auth/refresh-token").set("authorization", "refreshToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtNTJuaXUyZDAwMDB3M2pvZXUzOHYxbnkiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTczNTA5OTY1NiwiZXhwIjoxNzM1MTg2MDU2fQ.NeYNvdz-pJrF6HXXlJgQ2THLAv7C46-RZUMDhoANuNQ");
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe("Refresh token success");
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the refresh token is invalid", async () => {
        const response = await request(server).post("/api/v1/auth/refresh-token").set("authorization", "refreshToken invalidToken");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid token");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the authorization header is missing", async () => {
        const response = await request(server).post("/api/v1/auth/refresh-token");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Token not found");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the refresh token format is invalid", async () => {
        const response = await request(server).post("/api/v1/auth/refresh-token").set("authorization", "Invalid token");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid token format");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the refresh token is missing", async () => {
        const response = await request(server).post("/api/v1/auth/refresh-token").set("authorization", "refreshToken");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid token format");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the refresh token is expired", async () => {
        const response = await request(server).post("/api/v1/auth/refresh-token").set("authorization", "refreshToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtNTNkamJ2NTAwMDB3Mzlzbjg2YW9vNGsiLCJlbWFpbCI6Im5ld3VzZXJAZ21haWwuY29tIiwiaWF0IjoxNzM1MDk5NjU3LCJleHAiOjE3MzUxODYwNTd9.YYjkKNAOsWG4uJHlGSbWSfGqTY7-z4iaQ4CAivsey-o");
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Token has expired");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });
});
