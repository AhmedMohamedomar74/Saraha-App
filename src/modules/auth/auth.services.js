import userModel from "./../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import {compareHash, genrateHash} from "../../utils/secuirty/hash.services.js"
import  jwt  from "jsonwebtoken"
export const signup = asyncHandler(async (req, res, next) => {
    /**
         * @Doing
         * reterive data 
         * check user existance with number and email
         * save to db 
         *
         * hash password 
         * send email OTP
         * send session
         */

    /**
     * @error 
     * the phone number save as null and same to email
     */
    const { password } = req.body
    let n_password = await genrateHash({plainText : password , saltRound:parseInt(process.env.HASH_SALT_ROUND)})
    req.body.password = n_password
    // console.log({n_password})
    // console.log(req.body)
    const newUser = await create({
        model: userModel,
        data: req.body
    });

    console.log(newUser.age)
    successResponce({ res: res, data: newUser })
    return
})

export const login = asyncHandler(async (req, res, next) => {
    let ISmatch = false
    let FindUser
    const { email, password, phoneNumber } = req.body
    if (phoneNumber) {
        FindUser = await findOne({model:userModel , filter : { phoneNumber: phoneNumber }})
        if (FindUser) {
            ISmatch = true
        }
    }
    else if (email) {
        FindUser = await findOne({model:userModel , filter : { email: email }})
        console.log(FindUser)
        if (FindUser) {
            ISmatch = true
        }
    }
    else {
        // next(
        next(Error("There is no phone and email", { cause: 400 }))
        return
    }

    if (ISmatch == false) {
        next(Error("not found", { cause: 404 }))
        return
    }
    else {
        // console.log(FindUser)
        const encryptionFlag = await compareHash({plainText : password , hashText:FindUser.password})
        console.log({ encryptionFlag, FindUser })
        if (encryptionFlag) {
            const acessToken = jwt.sign({IslogIn : true , _id : FindUser.id},process.env.HASH_KEY,{expiresIn:"0.5h"})
            const refreshToken = jwt.sign({IslogIn : true , _id : FindUser.id},process.env.HASH_KEY,{expiresIn:"1y"})
            successResponce({ res: res, data: {acessToken , refreshToken} })
            return
        }
        else {
            next(Error("wrong passord", { cause: 401 }))
            return
        }
    }
})


