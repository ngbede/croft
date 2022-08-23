"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = void 0;
require("dotenv/config");
exports.params = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: parseInt(process.env.dbPort),
    max: 30,
    idleTimeoutMillis: 300000,
    connectionTimeoutMillis: 60000
};
