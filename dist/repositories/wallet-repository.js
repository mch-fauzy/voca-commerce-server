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
exports.WalletRepository = void 0;
const prisma_client_1 = require("../configs/prisma-client");
const winston_1 = require("../configs/winston");
const failure_1 = require("../utils/failure");
class WalletRepository {
}
exports.WalletRepository = WalletRepository;
_a = WalletRepository;
WalletRepository.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_client_1.prisma.voca_wallet.create({ data: data });
    }
    catch (error) {
        winston_1.logger.error(`[WalletRepository.create] Error creating wallet: ${error}`);
        throw failure_1.Failure.internalServer('Failed to create wallet');
    }
});
WalletRepository.updateById = (primaryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isWalletAvailable = yield _a.existsById(primaryId);
        if (!isWalletAvailable)
            throw failure_1.Failure.notFound(`Wallet not found`);
        yield prisma_client_1.prisma.voca_wallet.update({
            where: { id: primaryId.id },
            data: data
        });
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[WalletRepository.updateById] Error updating wallet by id: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update wallet by id');
    }
});
WalletRepository.findManyAndCountByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectFields, filterFields, pagination, sorts } = filter;
        // Handle select specific field (output: create a single object from array of array)
        const select = selectFields
            ? Object.fromEntries(selectFields.map((field) => [field, true]) // array of array
            )
            : undefined;
        // Handle filter field (output: create a single object from array of array)
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]) // array of array
            )
            : undefined;
        // Handle pagination
        const skip = pagination ? (pagination.page - 1) * pagination.pageSize : undefined;
        const take = pagination ? pagination.pageSize : undefined;
        // Handle sort (output: array of object)
        const orderBy = sorts === null || sorts === void 0 ? void 0 : sorts.filter(sort => sort.field).map(({ field, order }) => ({ [field]: order }));
        const [wallets, totalWallets] = yield prisma_client_1.prisma.$transaction([
            prisma_client_1.prisma.voca_wallet.findMany({
                select,
                where,
                skip,
                take,
                orderBy
            }),
            prisma_client_1.prisma.voca_wallet.count({
                where
            })
        ]);
        return [wallets, totalWallets];
    }
    catch (error) {
        winston_1.logger.error(`[WalletRepository.findManyAndCountByFilter] Error finding and counting wallets by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to find and count wallets by filter');
    }
});
WalletRepository.countByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filterFields } = filter;
        const where = filterFields
            ? Object.fromEntries(filterFields.map(({ field, operator, value }) => [field, { [operator]: value }]))
            : undefined;
        const totalWallets = yield prisma_client_1.prisma.voca_wallet.count({
            where
        });
        return totalWallets;
    }
    catch (error) {
        winston_1.logger.error(`[WalletRepository.countByFilter] Error counting wallets by filter: ${error}`);
        throw failure_1.Failure.internalServer('Failed to count wallets by filter');
    }
});
// Exists is a verb, if you want to use "is", please use isAvailable or isPresent
WalletRepository.existsById = (primaryId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma_client_1.prisma.voca_wallet.findUnique({
            where: { id: primaryId.id },
            select: { id: true }
        });
        return product ? true : false;
    }
    catch (error) {
        winston_1.logger.error('[WalletRepository.existsById] Error determining wallet by id');
        throw failure_1.Failure.internalServer('Failed to determine wallet by id');
    }
});
