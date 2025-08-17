import { findOne } from "../DB/db.services.js";
import userModel, { providerEnum } from "../DB/models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareHash } from "../utils/secuirty/hash.services.js";
import { decodeToken, signatureKeySelectEnum} from "../utils/secuirty/token.services.js"


export const auth = decodeToken({selectKey : signatureKeySelectEnum.acess})
export const refreshAuth = decodeToken({selectKey : signatureKeySelectEnum.refresh})


export const validateLoginCredentials = asyncHandler(async (req, res, next) => {
    const { email, phoneNumber } = req.body;
    
    if (!email && !phoneNumber) {
        return next(new Error("Email or phone number is required", { cause: 400 }));
    }

    const filter = {};
    if (phoneNumber) {
        filter.phoneNumber = phoneNumber;
        filter.provider = providerEnum.system; // Only system users can login with phone
    } else if (email) {
        filter.email = email;
    }

    const user = await findOne({ model: userModel, filter });
    
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    req.user = user;
    next();
});


export const validatePassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const { user } = req;

    if (!password) {
        return next(new Error("Password is required", { cause: 400 }));
    }

    const isMatch = await compareHash({ 
        plainText: password, 
        hashText: user.password 
    });

    if (!isMatch) {
        return next(new Error("Invalid password", { cause: 401 }));
    }

    next();
});