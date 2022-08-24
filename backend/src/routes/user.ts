import { Router } from "express"
import { getUserViaId, createUser, resetPassword, signIn, deleteUser } from "../controllers/user-controller"
// TODO: edit user ino
const userRoute = Router()

userRoute.get("/user/:id", getUserViaId)
userRoute.post("/user/signup", createUser)
userRoute.post("/user/reset-password", resetPassword)
userRoute.put("/user/signin", signIn)
// userRoute.delete("/user/:id", deleteUser)

export default userRoute