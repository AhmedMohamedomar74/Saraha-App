import userModel from "../DB/models/User.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { successResponce } from "../utils/Response.js"
import { create, findOne } from "../DB/db.services.js"
import jwt from "jsonwebtoken"


export const auth = asyncHandler(async (req, res, next) => {
    let decode = undefined
    // console.log()
    const { authorization } = req.headers
    const [Bearer , token] = authorization.split(" ")
    if (!Bearer || !token) {
        return next(new Error("Authorization token is required", { cause: 401 }))
    }

    switch (Bearer) {
        case "Bearer":
            decode = jwt.verify(token,process.env.USER_ACESS_TOKEN_SIGNATURE)
            break;
        case "system" : 
            decode = jwt.verify(token,process.env.SYSTEM_ACESS_TOKEN_SIGNATURE)
        default:
            break;
    }

    
    // console.log(decode)
    const findUser = await findOne({ model: userModel, filter: { _id: decode._id } })

    if (!findUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    // successResponce({res:res , data:findUser})
    req.user = findUser
    next()
})

