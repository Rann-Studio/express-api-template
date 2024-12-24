import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import { createServer, Server } from "http";
import { AppError, logErrorToFile, RequestException } from "./v1/utils/error";
import { createResponse, normalizePort } from "./v1/utils/helper";
import routesV1 from "./v1/routes";

dotenv.config();

export const app: Express = express();
export const server: Server = createServer(app);
const port: number = normalizePort(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    const response = createResponse(200, "Hello, World!");
    res.status(response.statusCode).json(response);
});

app.use("/api", routesV1);

app.use((req: Request, res: Response) => {
    const response = createResponse(404, "Not Found");
    res.status(response.statusCode).json(response);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : err instanceof RequestException ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : err instanceof RequestException ? err.message : "Internal Server Error";
    const error = err instanceof AppError ? err.error : err instanceof RequestException ? err.error : undefined;
    const stackTrace = err instanceof AppError ? err.stack : undefined;

    const response = createResponse(statusCode, message, undefined, error, stackTrace);
    res.status(statusCode).json(response);

    if (err instanceof AppError) {
        console.error(err.originalError);
        logErrorToFile(err.originalError);
    } else if (statusCode === 500) {
        console.error(err);
        logErrorToFile(err.stack);
    }
});

if (require.main === module) {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
