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
