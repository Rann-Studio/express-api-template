import request from "supertest";
import { server } from "../../../index";

describe("Auth Sign In", () => {
    it("should return a successful response with valid credentials", async () => {
        const response = await request(server).post("/api/v1/auth/signin").send({
            email: "admin@gmail.com",
            password: "@Password123",
        });
        expect(response.status).toBe(200);
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe("Sign in success");
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the email is incorrect", async () => {
        const response = await request(server).post("/api/v1/auth/signin").send({
            email: "admin123@gmail.com",
            password: "@Password123",
        });
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a failed response when the password is incorrect", async () => {
        const response = await request(server).post("/api/v1/auth/signin").send({
            email: "admin@gmail.com",
            password: "@Password12345",
        });
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeUndefined();
    });

    it("should return a validation error when credentials are missing", async () => {
        const response = await request(server).post("/api/v1/auth/signin").send({});
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation error");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
    });

    it("should return a validation error when email is missing", async () => {
        const response = await request(server).post("/api/v1/auth/signin").send({
            password: "@Password123",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation error");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
    });

    it("should return a validation error when password is missing", async () => {
        const response = await request(server).post("/api/v1/auth/signin").send({
            email: "admin@gmail.com",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation error");
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
    });
});
