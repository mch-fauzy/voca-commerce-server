import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import {
    ProductCreateRequest,
    ProductUpdateByIdRequest,
    ProductGetListByFilterRequest,
    ProductValidator,
    ProductDeleteByIdRequest,
    ProductSoftDeleteByIdRequest,
    ProductGetByIdRequest
} from '../models/dto/product-dto';
import { ProductService } from '../services/product-service';
import { CONSTANTS } from '../utils/constants';
import {
    responseWithMessage,
    responseWithMetadata
} from '../utils/response';

class ProductController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: ProductCreateRequest = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                available: req.body.available,
                userId: String(req.headers[CONSTANTS.HEADERS.USERID])
            };
            const validatedRequest = await ProductValidator.validateCreate(request);
            const response = await ProductService.create(validatedRequest);

            responseWithMessage(res, StatusCodes.CREATED, response);
        } catch (error) {
            next(error);
        }
    };

    static updateById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: ProductUpdateByIdRequest = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                available: req.body.available,
                id: Number(req.params.id),
                userId: String(req.headers[CONSTANTS.HEADERS.USERID])
            };
            const validatedRequest = await ProductValidator.validateUpdateById(request);
            const response = await ProductService.updateById(validatedRequest);

            responseWithMessage(res, StatusCodes.OK, response);
        } catch (error) {
            next(error);
        }
    };

    static deleteById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: ProductDeleteByIdRequest = {
                id: Number(req.params.id),
                userId: String(req.headers[CONSTANTS.HEADERS.USERID])
            };
            const validatedRequest = await ProductValidator.validateDeleteById(request);
            const response = await ProductService.deleteById(validatedRequest);

            responseWithMessage(res, StatusCodes.OK, response);
        } catch (error) {
            next(error);
        }
    };

    static softDeleteById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: ProductSoftDeleteByIdRequest = {
                id: Number(req.params.id),
                userId: String(req.headers[CONSTANTS.HEADERS.USERID])
            };
            const validatedRequest = await ProductValidator.validateSoftDeleteById(request);
            const response = await ProductService.softDeleteById(validatedRequest);

            responseWithMessage(res, StatusCodes.OK, response);
        } catch (error) {
            next(error);
        }
    };

    static restoreById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: Pick<ProductSoftDeleteByIdRequest, 'id'> = {
                id: Number(req.params.id)
            };
            const validatedRequest = await ProductValidator.validateRestoreById(request);
            const response = await ProductService.restoreById(validatedRequest);

            responseWithMessage(res, StatusCodes.OK, response);
        } catch (error) {
            next(error);
        }
    };

    static getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: ProductGetByIdRequest = {
                id: Number(req.params.id)
            };
            const validatedRequest = await ProductValidator.validateGetById(request);
            const response = await ProductService.getById(validatedRequest);

            responseWithMetadata(res, StatusCodes.OK, response.data, response.metadata);
        } catch (error) {
            next(error);
        }
    };

    static getListByFilter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: ProductGetListByFilterRequest = {
                page: req.query.page ? Number(req.query.page) : CONSTANTS.QUERY.DEFAULT_PAGE,
                pageSize: req.query.page_size ? Number(req.query.page_size) : CONSTANTS.QUERY.DEFAULT_PAGESIZE,
                sort: req.query.sort ? String(req.query.sort) : undefined,
                order: req.query.order ? String(req.query.order) : CONSTANTS.QUERY.DEFAULT_ORDER,
                name: req.query.name ? String(req.query.name) : undefined
            };
            const validatedRequest = await ProductValidator.validateGetListByFilter(request);
            const response = await ProductService.getListByFilter(validatedRequest);

            responseWithMetadata(res, StatusCodes.OK, response.data, response.metadata);
        } catch (error) {
            next(error);
        }
    };
}

export { ProductController };
