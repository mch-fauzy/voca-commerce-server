import { v4 as uuidv4 } from 'uuid';

import { UserRepository } from '../repositories/user-repository';
import { RegisterRequest, LoginRequest } from '../models/dto/auth-dto';
import { comparePassword, hashPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { CustomError } from '../utils/custom-errors';
import { CONSTANTS } from '../utils/constants';

class AuthService {
    static async register(req: RegisterRequest) {
        const isUserExist = await UserRepository.isUserExistsByEmail(req.email)
        if (isUserExist) throw CustomError.conflict('User already exists');

        const userId = uuidv4();
        const hashedPassword = await hashPassword(req.password);
        await UserRepository.createUser({
            ...req,
            id: userId,
            password: hashedPassword,
            createdBy: req.email,
            updatedBy: req.email
        });

        return { message: CONSTANTS.MESSAGE.SUCCESS };
    }

    static async login(req: LoginRequest) {
        const user = await UserRepository.getUserCredentialsByEmail(req.email)
        if (!user) throw CustomError.unauthorized('Invalid credentials');

        const isValidPassword = await comparePassword(req.password, user.password);
        if (!isValidPassword) throw CustomError.unauthorized('Invalid credentials');

        const token = generateToken({
            email: user.email,
            role: user.role,
        });

        return { token: token };
    }
};

export { AuthService };
