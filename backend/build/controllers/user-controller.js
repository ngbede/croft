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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.signIn = exports.resetPassword = exports.createUser = exports.getUserViaId = void 0;
const validator_1 = __importDefault(require("validator"));
const user_schema_1 = require("../schema/user-schema");
const init_1 = require("../db/init");
const account_exist_1 = __importDefault(require("../utils/account-exist"));
const getUserViaId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    const { data: user, error } = yield init_1.supabaseServer.auth.api.getUserById(id);
    //.from("auth.users").select("*").filter("id", "eq", id)
    if (error) {
        error.message = `user with id ${id} doesn't exist`;
        return res.status(error.status).json(error);
    }
    else {
        const { id, email, user_metadata, created_at, updated_at } = user;
        return res.status(200).json({
            id: id,
            email: email,
            user_data: user_metadata,
            created_at: created_at,
            updated_at: updated_at
        });
    }
});
exports.getUserViaId = getUserViaId;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error: validationError, value } = user_schema_1.userSchema.validate(req.body, { abortEarly: false });
    if (validationError) {
        const errors = validationError.details.map(errs => {
            return errs.message.replace('\"', "").replace("\"", "");
        });
        return res.status(422).json({
            message: "validation failed on request body",
            errors: errors
        });
    }
    const newUser = value;
    const { user, error } = yield init_1.supabaseServer.auth.api
        .createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            phone_number: newUser.phone_number,
            phone_number2: newUser.phone_number2,
            date_of_birth: newUser.date_of_birth
        }
    });
    if (error)
        return res.status(error.status).json(error);
    if (user) {
        // send a verification link to email
        const { data, error } = yield init_1.supabaseServer.auth.api.sendMagicLinkEmail(newUser.email, { shouldCreateUser: false
        });
        return res.status(200).json({
            id: user.id,
            email: user.email,
            user_data: user.user_metadata,
            verification_sent: data !== null,
            created_at: user.created_at,
            updated_at: user.updated_at
        });
    }
});
exports.createUser = createUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmail = validator_1.default.isEmail(req.body.email || '');
    let validUser;
    if (!isEmail) {
        return res.status(422).json({ message: "Invalid email sent" });
    }
    const { data: userList, error: userErrors } = yield init_1.supabaseServer.auth.api.listUsers();
    if (userList) {
        // check if user is amongst list of users
        validUser = userList.map(u => u.email).includes(req.body.email);
    }
    if (validUser) {
        const { data, error } = yield init_1.supabaseServer.auth.api.generateLink('recovery', "ogasule001@gmail.com");
        if (data) {
            // TODO: reduce data sent
            return res.status(200).json(data);
        }
        else {
            return res.status(500).json({
                message: "Internal server error, unable to send reset link",
                error: error
            });
        }
    }
    else
        return res.status(404).json({ message: "account doesn't exist" });
});
exports.resetPassword = resetPassword;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = req.body;
    const validEmail = validator_1.default.isEmail(info.email || '');
    if (!validEmail) {
        return res.status(422).json({ message: "Invalid email sent" });
    }
    if (typeof (info.password) !== 'string') {
        return res.status(422).json({ message: "password is a required field" });
    }
    const emailExist = yield (0, account_exist_1.default)(info.email);
    if (!emailExist) {
        return res.status(404).json({ message: "account doesn't exist" });
    }
    const { data, error } = yield init_1.supabaseServer.auth.api.signInWithEmail(info.email, info.password);
    if (data) {
        return res.status(200).json(data);
    }
    if (error) {
        error.message = "Invalid password";
        return res.status(error.status).json(error);
    }
});
exports.signIn = signIn;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidUUID = validator_1.default.isUUID(id);
    if (!isValidUUID) {
        return res.status(404).json({ message: "Invalid uuid sent" });
    }
    const { data, error } = yield init_1.supabaseServer.auth.api.deleteUser(id);
    if (error) {
        return res.status(error.status).json(error);
    }
    return res.status(200).json({
        message: `User with id ${id} has been deleted successfully`
    });
});
exports.deleteUser = deleteUser;
