import { Router } from "express";
import *as userServices from "./user.services.js"
import { auth } from "../../middelwares/auth.middleware.js";
const router = Router()

router.get("/",auth,userServices.profile)

export default router