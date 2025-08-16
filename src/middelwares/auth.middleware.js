import userModel from "../DB/models/User.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { successResponce } from "../utils/Response.js"
import { create, findOne } from "../DB/db.services.js"
import jwt from "jsonwebtoken"


export const auth = asyncHandler(async (req, res, next) => {
    // console.log()
    const { authorization } = req.headers
    if (!authorization) {
        return next(new Error("Authorization token is required", { cause: 401 }))
    }

    console.log({ authorization })
    const decode = jwt.verify(authorization, process.env.HASH_KEY)

    
    // console.log(decode)
    const findUser = await findOne({ model: userModel, filter: { _id: decode._id } })

    if (!findUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    // successResponce({res:res , data:findUser})
    req.user = findUser
    next()
})

