import userModel from "../DB/models/User.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { findOne } from "../DB/db.services.js"
import { selectSignatureLevel, verify } from "../utils/secuirty/token.services.js"


export const auth = asyncHandler(async (req, res, next) => {
    let decode = undefined
    // console.log()
    const { authorization } = req.headers
    const [Bearer , token] = authorization.split(" ")
    if (!Bearer || !token) {
        return next(new Error("Authorization token is required", { cause: 401 }))
    }
    const signatureLevel = selectSignatureLevel(Bearer)
    decode = verify({token : token, key : signatureLevel.access})

    
    // console.log(decode)
    const findUser = await findOne({ model: userModel, filter: { _id: decode._id } })

    if (!findUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    // successResponce({res:res , data:findUser})
    req.user = findUser
    next()
})

