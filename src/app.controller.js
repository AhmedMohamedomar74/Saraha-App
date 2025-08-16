import { testConnection } from "./DB/connection.db.js"
import express from "express"
import authController from "./modules/auth/auth.controller.js"
import userController from "./modules/user/user.controller.js"
import { glopalErrorHandling } from "./utils/glopalErrorHandling.js"

import path from "node:path"
import dotenv from "dotenv"


async function bootstrap() {
    dotenv.config({
        path: path.resolve("./config/dev.env")
    });
    const port = process.env.PORT
    const app = express()
    // DB
    testConnection()

    app.use(express.json())
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use(glopalErrorHandling)

    app.listen(port, () => {
        console.log(`Server is running on port = ${port}`)
    })
}

export default bootstrap