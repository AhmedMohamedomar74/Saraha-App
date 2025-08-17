import { Router } from "express";
import *as authServices from "./auth.services.js"
import { validateLoginCredentials, validatePassword } from "../../middelwares/auth.middleware.js";
const router = Router()

router.post("/signup",authServices.signup)
router.post("/signupWithGmail",authServices.signupGmail)
router.post("/loginWithGmail",authServices.signinGmail)
router.post("/login",validateLoginCredentials, validatePassword,authServices.login)

export default router