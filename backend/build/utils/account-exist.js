"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../db/init");
const checkAccount = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let validUser = false;
    const { data: userList, error: userErrors } = yield init_1.supabaseServer.auth.api.listUsers();
    if (userList) {
        // check if user is amongst list of users
        validUser = userList.map(u => u.email).includes(email);
    }
    if (userErrors) {
        throw new Error(userErrors.message);
    }
    return validUser;
});
exports.default = checkAccount;
