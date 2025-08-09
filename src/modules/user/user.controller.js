import { Router } from "express";
import *as userServices from "./user.services.js"
const router = Router()

router.get("/:id",userServices.getUserByID)
router.patch("/:id",userServices.updateUser)

export default router