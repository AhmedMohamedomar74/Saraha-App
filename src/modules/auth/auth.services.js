import userModel, { providerEnum, roleEnum } from "./../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import { compareHash, genrateHash } from "../../utils/secuirty/hash.services.js"
import { OAuth2Client } from 'google-auth-library'
import { generateAuthTokens, genrateToken, selectSignatureLevel, signatureLevelEnum } from "./../../utils/secuirty/token.services.js"
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
    const { provider } = req.body
    if (provider != providerEnum.goole) {
        const { password } = req.body
        if (password) {
            let n_password = await genrateHash({ plainText: password, saltRound: parseInt(process.env.HASH_SALT_ROUND) })
            req.body.password = n_password
        }
        else {
            next(new Error("there is no passowrd"), { cause: 400 })
        }

    }
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
    const tokens = generateAuthTokens(req.user);
    successResponce({ res, data: tokens });
})

async function verifyGoogle({ idToken = "" }) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    return ticket.getPayload();
}

export const signupGmaail = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body
    const bayload = await verifyGoogle({ idToken: idToken })
    const { email, name, picture, email_verified } = bayload
    if (email_verified) {
        const newUser = await create({
            model: userModel, data: {
                fullName: name,
                email: email,
                picture: picture,
                provider: providerEnum.goole
            }
        })
        successResponce({ res: res, data: newUser })
    }
    else {
        next(new Error("not verified email"), { cause: 403 })
    }
    console.log(bayload)
})