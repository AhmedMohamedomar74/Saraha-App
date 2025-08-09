export function successResponce({ res, status = 200,
    message = 'Success', data } = {}) {
    res.status(status).json({ message, data })
}

export function sendServerResponse(res, { status = 500,
    message = 'Server Error' } = {}) {
    res.status(status).json({ message })
}

export const failedResponse = ({ error, res } = {}) => {
    // if (error.errmsg.search("duplicate key")) {
    //     res.status(400).json({ message: "Email already exsists"})
    // }
    console.log({ error });
    switch (error.name) {
        case "ValidationError":
            res.status(400).json({ message: error.name, error })
            break;
        case "MongoServerError":
            if (error.errmsg.search("duplicate key")) {
                res.status(400).json({ message: "Email already exsits" })
                break;
            }
            else {
                res.status(500).json({ message: error.name, error })
                break;
            }

        case "not found":
            res.status(404).json({ message: error.message, error })
            break;
        case "SequelizeUniqueConstraintError":
            res.status(409).json({ message: error.name, error })
            break;

    }

    switch (error.code) {
        case 1100:
            res.status(400).json({ message: "user already exists", error })
            break;

        default:
            res.status(500).json({ message: error.name, info: error.info, stack: error.stack })
            break;
    }
}
