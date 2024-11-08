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
exports.UserWalletController = void 0;
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../utils/constants");
const user_wallet_service_1 = require("../services/user-wallet-service");
const http_response_1 = require("../utils/http-response");
class UserWalletController {
}
exports.UserWalletController = UserWalletController;
_a = UserWalletController;
UserWalletController.createWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = String(req.headers[constants_1.CONSTANTS.HEADERS.USERID]);
        const email = String(req.headers[constants_1.CONSTANTS.HEADERS.EMAIL]);
        const message = yield user_wallet_service_1.UserWalletService.createWallet({
            userId,
            email
        });
        (0, http_response_1.responseWithMessage)(res, http_status_codes_1.StatusCodes.CREATED, message);
    }
    catch (error) {
        next(error);
    }
});
UserWalletController.getBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = String(req.headers[constants_1.CONSTANTS.HEADERS.USERID]);
        const result = yield user_wallet_service_1.UserWalletService.getBalance({
            userId
        });
        (0, http_response_1.responseWithMetadata)(res, http_status_codes_1.StatusCodes.OK, result.data, result.metadata);
    }
    catch (error) {
        next(error);
    }
});
