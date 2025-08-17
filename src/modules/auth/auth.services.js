import userModel, { providerEnum, roleEnum } from "./../../DB/models/User.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { successResponce } from "../../utils/Response.js"
import { create, findOne } from "../../DB/db.services.js"
import { compareHash, genrateHash } from "../../utils/secuirty/hash.services.js"
import { OAuth2Client } from 'google-auth-library'
import { genrateToken, selectSignatureLevel, signatureLevelEnum } from "./../../utils/secuirty/token.services.js"
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
    let ISmatch = false
    let FindUser
    const { email, password, phoneNumber } = req.body
    if (phoneNumber) {
        FindUser = await findOne({ model: userModel, filter: { phoneNumber: phoneNumber  , provider : providerEnum.system} })
        if (FindUser) {
            ISmatch = true
        }
    }
    else if (email) {
        FindUser = await findOne({ model: userModel, filter: { email: email } })
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

        const signatureLevel = FindUser.role == roleEnum.user ? signatureLevelEnum.user : signatureLevelEnum.admin
        let signatures = selectSignatureLevel(signatureLevel)
        const encryptionFlag = await compareHash({ plainText: password, hashText: FindUser.password })
        console.log({ encryptionFlag, FindUser })
        if (encryptionFlag) {
            const acessToken = genrateToken(
                {
                    data: { IslogIn: true, _id: FindUser.id },
                    key: signatures.access,
                    options: { expiresIn: process.env.ACESS_TOKEN_EXPIRE_IN }
                }
            )
            const refreshToken = genrateToken(
                {
                    data: { IslogIn: true, _id: FindUser.id },
                    key: signatures.refresh,
                    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
                })
            successResponce({ res: res, data: { acessToken, refreshToken } })
            return
        }
        else {
            next(Error("wrong passord", { cause: 401 }))
            return
        }
    }
})


/**
 * 
 * {
  iss: 'https://accounts.google.com',
  azp: '1087607913237-affnjkv2cdqbeuigmumhddh3t73742tr.apps.googleusercontent.com',
  aud: '1087607913237-affnjkv2cdqbeuigmumhddh3t73742tr.apps.googleusercontent.com',
  sub: '107894381789248334092',
  email: 'ahmedmohamedomar74@gmail.com',
  email_verified: true,
  nbf: 1755442587,
  name: 'ahmed mohamedomar',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocI1VdrnTKK46izXwfFlfMftr6Td6bDIkh-d9ctzmFZPXiyqMyM=s96-c',
  given_name: 'ahmed',
  family_name: 'mohamedomar',
  iat: 1755442887,
  exp: 1755446487,
  jti: '1df50cc82e26c5bd778d615b032ab629ce55015a'
}
 */

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
    else
    {
        next(new Error ("not verified email") , {cause : 403 })
    }
    console.log(bayload)
})