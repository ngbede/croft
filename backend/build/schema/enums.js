"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockOperations = exports.StockTypes = exports.FarmRoles = void 0;
var FarmRoles;
(function (FarmRoles) {
    FarmRoles["stockReport"] = "stockReport";
    FarmRoles["createUser"] = "createUser";
    FarmRoles["editUser"] = "editUser";
    FarmRoles["deleteUser"] = "deleteUser";
    FarmRoles["orders"] = "orders";
})(FarmRoles = exports.FarmRoles || (exports.FarmRoles = {}));
var StockTypes;
(function (StockTypes) {
    StockTypes["eggCount"] = "egg-count";
    StockTypes["chickenCount"] = "chicken-count";
})(StockTypes = exports.StockTypes || (exports.StockTypes = {}));
var StockOperations;
(function (StockOperations) {
    StockOperations["add"] = "add";
    StockOperations["delete"] = "delete";
})(StockOperations = exports.StockOperations || (exports.StockOperations = {}));
