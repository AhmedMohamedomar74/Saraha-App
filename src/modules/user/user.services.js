import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"

export const profile = asyncHandler(async (req , res , next)=>
{
    // console.log()
    successResponce({res:res , data:req.user})
})