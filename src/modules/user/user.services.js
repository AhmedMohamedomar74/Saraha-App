import userModel from "./../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import {compareHash, genrateHash} from "../../utils/secuirty/hash.services.js"
import  jwt  from "jsonwebtoken"

export const profile = asyncHandler(async (req , res , next)=>
{
    // console.log()
    const {authorization} = req.headers
    console.log({authorization})
    const decode = jwt.verify(authorization,"321rfredgsf")
    // console.log(decode)
    const findUser = await findOne({model:userModel , filter : {_id : decode._id}})
    successResponce({res:res , data:findUser})
})