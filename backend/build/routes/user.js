"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
// TODO: edit user ino
const userRoute = (0, express_1.Router)();
userRoute.get("/user/:id", user_controller_1.getUserViaId);
userRoute.post("/user/signup", user_controller_1.createUser);
userRoute.post("/user/reset-password", user_controller_1.resetPassword);
userRoute.put("/user/signin", user_controller_1.signIn);
userRoute.delete("/user/:id", user_controller_1.deleteUser);
exports.default = userRoute;
