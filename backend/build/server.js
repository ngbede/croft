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
const app_1 = __importDefault(require("./app"));
const init_1 = require("./db/init");
const pg_1 = require("./db/pg");
// TODO: Deploy app to digital ocean
app_1.default.listen(4000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pg_1.pgInstance.connect()
            .then(_ => {
            if (init_1.supabaseServer && init_1.supabase)
                console.log("Running on port 4000");
            else
                console.log("client failed to connect");
        });
    }
    catch (error) {
        throw new Error(`${error}`);
    }
}));
