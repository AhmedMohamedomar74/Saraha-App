import { Router } from "express";
import *as authServices from "./auth.services.js"
const router = Router()

router.post("/signup",authServices.signup)
router.post("/signupWithGmail",authServices.signupGmaail)
router.post("/login",authServices.login)

export default router