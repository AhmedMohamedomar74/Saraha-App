import jwt from "jsonwebtoken"
export const signatureLevelEnum = {admin : "admin" , user : "Bearer"}
export const genrateToken = ({ data = {}, key = {}, options = {} }) => {
    return jwt.sign(data, key, options)
}

export const verify = ({ token = {}, key = {} }) => {
    return jwt.verify(token, key)
}

export const selectSignatureLevel = (signatureLevel) => {
    let signatures = { access: undefined, refresh: undefined }
    switch (signatureLevel) {
        case signatureLevelEnum.user:
            signatures.access = process.env.USER_ACESS_TOKEN_SIGNATURE
            signatures.refresh = process.env.USER_REFRESH_TOKEN_SIGNATURE
            break;

        case signatureLevelEnum.admin:
            signatures.access = process.env.SYSTEM_ACESS_TOKEN_SIGNATURE
            signatures.refresh = process.env.SYSTEM_REFRESH_TOKEN_SIGNATURE
            break;

        default:
            break;
    }
    return signatures
}