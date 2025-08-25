import { v4 as uuidv4 } from 'uuid';

import { UserRepository } from '../repositories/user-repository';
import {
    AuthRegisterRequest,
    AuthLoginRequest,
    AuthLoginResponse
} from '../models/dto/auth-dto';
import {
    comparePassword,
    hashPassword
} from '../utils/password';
import { generateToken } from '../utils/jwt';
import { Failure } from '../utils/failure';
import { logger } from '../configs/winston';
import { USER_DB_FIELD } from '../models/user-model';

class AuthService {
    static register = async (req: AuthRegisterRequest) => {
        try {
            const totalUsers = await UserRepository.countByFilter({
                filterFields: [{
                    field: USER_DB_FIELD.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers !== 0) throw Failure.conflict('User with this email already exists');

            const userId = uuidv4();
            const hashedPassword = await hashPassword(req.password);
            await UserRepository.create({
                email: req.email,
                role: req.role,
                id: userId,
                password: hashedPassword,
                createdBy: req.email,
                updatedBy: req.email
            });

            return 'Success';
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[AuthService.register] Error registering user: ${error}`);
            throw Failure.internalServer('Failed to register user');
        }
    };

    static login = async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    USER_DB_FIELD.id,
                    USER_DB_FIELD.email,
                    USER_DB_FIELD.password,
                    USER_DB_FIELD.role
                ],
                filterFields: [{
                    field: USER_DB_FIELD.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === 0) throw Failure.unauthorized('Invalid credentials');

            const isValidPassword = await comparePassword(req.password, users[0].password);
            if (!isValidPassword) throw Failure.unauthorized('Invalid credentials');

            const response = generateToken({
                userId: users[0].id,
                email: users[0].email,
                role: users[0].role
            });

            return response;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[AuthService.login] Error login user: ${error}`);
            throw Failure.internalServer('Failed to login user');
        }
    };
}

export { AuthService };
