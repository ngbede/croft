"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseErrors = (errorBody) => {
    if (!errorBody)
        return []; // no errors
    const { details } = errorBody;
    const errors = details.map(errs => {
        return errs.message.replace('\"', "").replace("\"", "");
    });
    return errors;
};
exports.default = parseErrors;
