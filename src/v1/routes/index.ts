import { Router } from "express";
import authRouter from "./auth";

const router = Router();

router.use("/v1/auth", authRouter);

export default router;
