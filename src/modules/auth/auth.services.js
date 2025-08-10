import { failedResponse ,successResponce } from "../services.js"
import userModel from "./../../DB/models/User.model.js"
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
