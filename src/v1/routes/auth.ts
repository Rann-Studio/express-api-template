import { Router } from "express";
import * as authController from "../controllers/auth";
import { checkRefreshToken } from "../middlewares/auth";

const router = Router();

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);
router.post("/refresh-token", checkRefreshToken, authController.refreshToken);

export default router;
