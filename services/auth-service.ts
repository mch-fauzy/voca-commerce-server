import { v4 as uuidv4 } from 'uuid';

import { UserRepository } from '../repositories/user-repository';
import {
    RegisterRequest,
    LoginRequest,
    LoginResponse
} from '../models/dto/auth-dto';
import {
    comparePassword,
    hashPassword
} from '../utils/password';
import { generateToken } from '../utils/jwt';
import { CustomError } from '../utils/custom-error';
import { logger } from '../configs/winston';
import { USER_DB_FIELD } from '../models/user-model';

class AuthService {
    static register = async (req: RegisterRequest) => {
        try {
            const isUserExist = await UserRepository.isUserExistByEmail(req.email)
            if (isUserExist) throw CustomError.conflict('Account with this email already exists');

            const userId = uuidv4();
            const hashedPassword = await hashPassword(req.password);
            await UserRepository.createUser({
                email: req.email,
                role: req.role,
                id: userId,
                password: hashedPassword,
                createdBy: req.email,
                updatedBy: req.email
            });

            return 'Success';
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[register] Service error registering user: ${error}`);
            throw CustomError.internalServer('Failed to register user');
        }
    }

    static login = async (req: LoginRequest) => {
        try {
            const user = await UserRepository.getUserByEmail(req.email, {
                selectFields: [
                    USER_DB_FIELD.email,
                    USER_DB_FIELD.password,
                    USER_DB_FIELD.role
                ]
            });
            if (!user) throw CustomError.unauthorized('Invalid credentials');

            const isValidPassword = await comparePassword(req.password, user.password);
            if (!isValidPassword) throw CustomError.unauthorized('Invalid credentials');

            const response: LoginResponse = generateToken({
                email: user.email,
                role: user.role
            });

            return response;
        } catch (error) {
            if (error instanceof CustomError) throw error;

            logger.error(`[login] Service error login user: ${error}`);
            throw CustomError.internalServer('Failed to login user');
        }
    }
}

export { AuthService };
