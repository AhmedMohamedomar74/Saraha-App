import { failedResponse ,successResponce } from "../services.js"
import userModel from "../../DB/models/User.model.js"

export const getUserByID = async(req,res,next)=>
{
    try {
        const FindUser  = await userModel.findById(req.params.id)
        if (FindUser != null) {
            successResponce({res:res , status:200 ,data:FindUser})
        }
        else
        {
            const error = new Error("User not found");
            error.name = "not found";
            throw error;
        }
    } catch (error) {
        failedResponse({res:res,error:error})
    }
}

export const updateUser = async(req,res,next)=>
{
    const {email, name ,age} = req.body
    try {
        const updateUser = await userModel.updateOne({_id: req.params.id}, {
            $set:
            {
                email,
                name,
                age
            },
            $inc:{__v : 1}
        })
        console.log(updateUser.matchedCount)
        if (Number(updateUser.matchedCount) == 0) {
            const error = new Error("User not found");
            error.name = "not found";
            throw error;
        }
        else
        {
            successResponce({res:res , status:200 ,data:updateUser})
        }
    } catch (error) {
        // if (error.errmsg.search("duplicate key")) {
        //     res.status(400).json({ message: "Email already exsists"})
        // }
        failedResponse({res:res,error:error})
    }
}