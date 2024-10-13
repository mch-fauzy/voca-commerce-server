import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProductValidator } from '../models/dto/product-dto';
import { ProductService } from '../services/product-service';
import { CONSTANTS } from '../utils/constants';
import { responseWithData, responseWithMessage, responseWithMetadata } from '../utils/http-response';

class ProductController {
    static createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = String(req.headers[CONSTANTS.HEADERS.EMAIL]);
            const body = await ProductValidator.validateCreateProductBody(req.body);
            // Assign object explicitly to enforce strict type (Excess Property Checks)
            const result = await ProductService.createProduct(
                {
                    email,
                    name: body.name,
                    description: body.description,
                    price: body.price,
                    available: body.available,
                }
            );

            responseWithMessage(res, StatusCodes.CREATED, result);
        } catch (error) {
            next(error);
        }
    }

    static updateProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const email = String(req.headers[CONSTANTS.HEADERS.EMAIL]);
            const body = await ProductValidator.validateUpdateProductBody(req.body);
            const result = await ProductService.updateProductById(
                {
                    id: Number(id),
                    email,
                    name: body.name,
                    description: body.description,
                    price: body.price,
                    available: body.available
                }
            );

            responseWithMessage(res, StatusCodes.OK, result);
        } catch (error) {
            next(error);
        }
    }

    static deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await ProductService.deleteProductById(
                {
                    id: Number(id)
                }
            );

            responseWithMessage(res, StatusCodes.OK, result);
        } catch (error) {
            next(error);
        }
    }

    static markProductAsDeletedById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const email = String(req.headers[CONSTANTS.HEADERS.EMAIL]);
            // Assign object explicitly to enforce strict type (Excess Property Checks)
            const result = await ProductService.markProductAsDeletedById(
                {
                    id: Number(id),
                    email,
                }
            );

            responseWithMessage(res, StatusCodes.OK, result);
        } catch (error) {
            next(error);
        }
    }

    static getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const result = await ProductService.getProductById(
                {
                    id: Number(id)
                }
            );

            responseWithMetadata(res, StatusCodes.OK, result.data, result.metadata);
        } catch (error) {
            next(error);
        }
    }

    static getProductsByFilter = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = await ProductValidator.validateGetProductsByFilterQuery(req.query);
            const result = await ProductService.getProductsByFilter(
                {
                    name: query.name,
                    sort: query.sort,
                    order: query.order ?? 'desc',
                    page: query.page ?? CONSTANTS.PAGINATION.DEFAULT_PAGE, // if null or undefined then use default value
                    pageSize: query.pageSize ?? CONSTANTS.PAGINATION.DEFAULT_PAGESIZE
                }
            );

            responseWithMetadata(res, StatusCodes.OK, result.data, result.metadata);
        } catch (error) {
            next(error);
        }
    }
}

export { ProductController };
