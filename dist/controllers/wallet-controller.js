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
const http_response_1 = require("../utils/http-response");
class WalletController {
}
exports.WalletController = WalletController;
_a = WalletController;
WalletController.createOwnWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = String(req.headers[constants_1.CONSTANTS.HEADERS.USERID]);
        const email = String(req.headers[constants_1.CONSTANTS.HEADERS.EMAIL]);
        const message = yield wallet_service_1.WalletService.createWalletByUserId({
            userId,
            email
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, message);
    }
    catch (error) {
        next(error);
    }
});
WalletController.getOwnBalanceFromWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = String(req.headers[constants_1.CONSTANTS.HEADERS.USERID]);
        const response = yield wallet_service_1.WalletService.getBalanceFromWalletByUserId({
            userId
        });
        (0, http_response_1.responseWithData)(res, http_status_codes_1.StatusCodes.OK, response);
    }
    catch (error) {
        next(error);
    }
});
