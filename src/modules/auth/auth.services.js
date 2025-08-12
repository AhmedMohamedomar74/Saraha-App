import userModel from "./../../DB/models/User.model.js"
import bcrypt  from "bcryptjs"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"

export const signup = asyncHandler(async(req, res, next) => {
    /**
         * @Doing
         * reterive data 
         * check user existance with number and email
         * save to db 
         */

        /**
         * @todo
         * hash password 
         * send email OTP
         * send session
         */

        /**
         * @error 
         * the phone number save as null and same to email
         */
        const {password} =  req.body
        let n_password = bcrypt.hashSync(password,10)
        req.body.password = n_password
        // console.log({n_password})
        // console.log(req.body)
        const newUser = new userModel(req.body)
        await newUser.save()
        console.log(newUser.age)
        successResponce({res:res , data : newUser})
        return
})

export const login = asyncHandler(async (req,res,next)=>
{
    let ISmatch = false
    let encryptionFlag = false
    let FindUser
    const {email , password , phoneNumber} = req.body
    if (phoneNumber) {
            FindUser = await userModel.findOne({phoneNumber : phoneNumber})
            if (FindUser) {
                ISmatch = true
            }
        }
        else if (email) {
            FindUser = await userModel.findOne({email : email})
            console.log(FindUser)
            if (FindUser) {
                ISmatch = true
            }
        }
        else
        {
            // next(
            next(Error("There is no phone and email" , {cause : 400}))
            return
        }

        if (ISmatch == false) {
            next(Error("not found" , {cause : 404}))
            return
        }
        else
        {
            // console.log(FindUser)
            encryptionFlag = bcrypt.compareSync(password,FindUser.password)
            console.log({encryptionFlag , FindUser})
            if (encryptionFlag) {
                successResponce({res:res , data : FindUser})
                return
            }
            else
            {
                next(Error("wrong passord" , {cause : 401}))
                return
            }
        }
})


