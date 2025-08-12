import { Router } from "express";
import *as userServices from "./user.services.js"
const router = Router()

router.get("/",userServices.profile)

export default router