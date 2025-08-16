import { decodeToken, signatureKeySelectEnum} from "../utils/secuirty/token.services.js"


export const auth = decodeToken({selectKey : signatureKeySelectEnum.acess})
export const refreshAuth = decodeToken({selectKey : signatureKeySelectEnum.refresh})
