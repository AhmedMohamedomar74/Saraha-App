import {testConnection} from "./DB/connection.db.js"
import express from "express"
import authController from "./modules/auth/auth.controller.js"
import userController from "./modules/user/user.controller.js"
async function bootstrap()
{
    const port = 3000
    const app = express()
    // DB
    testConnection()

    app.use(express.json())
    app.use("/auth",authController)
    app.use("/users",userController)
    app.listen(port, () => {
        console.log(`Server is running on port = ${port}`)
    })
}

export default bootstrap