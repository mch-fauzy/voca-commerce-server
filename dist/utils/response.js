"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseWithMetadata = exports.responseWithData = exports.responseWithMessage = void 0;
const responseWithMessage = (res, code, message) => {
    res.status(code).send({ message: message });
};
exports.responseWithMessage = responseWithMessage;
const responseWithData = (res, code, data) => {
    res.status(code).json({ data: data });
};
exports.responseWithData = responseWithData;
const responseWithMetadata = (res, code, data, metadata) => {
    res.status(code).json({ data: data, metadata: metadata });
};
exports.responseWithMetadata = responseWithMetadata;
