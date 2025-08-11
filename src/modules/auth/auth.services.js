import { failedResponse ,successResponce } from "../services.js"
import userModel from "./../../DB/models/User.model.js"
import bcrypt  from "bcryptjs"
export const signup = async (req, res, next) => {
    try {

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
    } catch (error) {
        failedResponse({error:error , res:res})
        return
    }
}

export const login = async (req,res,next)=>
{
    let ISmatch = false
    let encryptionFlag = false
    let FindUser
    const {email , password , phoneNumber} = req.body
    try {
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
            throw new Error("There is no phone and email")
            return
        }

        if (ISmatch == false) {
            throw new Error("not found")
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
                throw new Error("wrong passord")
                return
            }
        }


    } catch (error) {
        failedResponse({error:error , res:res})
    }

}
