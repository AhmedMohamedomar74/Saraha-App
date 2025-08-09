import { Router } from "express";
import *as authServices from "./auth.services.js"
const router = Router()

router.post("/signup",authServices.signup)

export default router