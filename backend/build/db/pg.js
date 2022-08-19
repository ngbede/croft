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
exports.pgInstance = exports.Pg = void 0;
const pg_1 = require("pg");
const pg_client_1 = require("./pg-client");
class Pg {
    constructor(params) {
        this.params = params;
    }
    connect() {
        this._pool = new pg_1.Pool(this.params);
        return this._pool.connect();
    }
    disconnect() {
        return this._pool.end();
    }
    query(queryString, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = yield this._pool.query(queryString, queryParams);
                return q;
            }
            catch (e) {
                throw new Error(`${e}`);
            }
        });
    }
}
exports.Pg = Pg;
// create new instance
exports.pgInstance = new Pg(pg_client_1.params);
