import { Response } from 'express';

const responseWithMessage = (res: Response, code: number, message: string) => {
    res.status(code).send({ message: message });
};

const responseWithData = (res: Response, code: number, data: object) => {
    res.status(code).json({ data: data });
};

const responseWithMetadata = (res: Response, code: number, data: object, metadata: object) => {
    res.status(code).json({ data: data, metadata: metadata });
};

export { responseWithMessage, responseWithData, responseWithMetadata };
