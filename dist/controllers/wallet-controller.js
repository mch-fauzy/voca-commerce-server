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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../utils/constants");
const wallet_service_1 = require("../services/wallet-service");
const response_1 = require("../utils/response");
const wallet_dto_1 = require("../models/dto/wallet-dto");
class WalletController {
}
exports.WalletController = WalletController;
_a = WalletController;
WalletController.createForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            userId: String(req.headers[constants_1.CONSTANTS.HEADERS.USERID]),
            email: String(req.headers[constants_1.CONSTANTS.HEADERS.EMAIL])
        };
        const validatedRequest = yield wallet_dto_1.WalletValidator.validateCreate(request);
        const response = yield wallet_service_1.WalletService.create(validatedRequest);
        (0, response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, response);
    }
    catch (error) {
        next(error);
    }
});
WalletController.getBalanceForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            userId: String(req.headers[constants_1.CONSTANTS.HEADERS.USERID])
        };
        const validatedRequest = yield wallet_dto_1.WalletValidator.validateGetBalanceByUserId(request);
        const response = yield wallet_service_1.WalletService.getBalanceByUserId(validatedRequest);
        (0, response_1.responseWithMetadata)(res, http_status_codes_1.StatusCodes.OK, response.data, response.metadata);
    }
    catch (error) {
        next(error);
    }
});
