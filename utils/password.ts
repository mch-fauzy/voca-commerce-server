import { hash, compare, genSalt } from 'bcryptjs';

const hashPassword = async (password: string, saltRounds: number = 10) => {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
};

const comparePassword = async (inputPassword: string, storedPassword: string) => {
    const isValidPassword = await compare(inputPassword, storedPassword);
    return isValidPassword;
};

export { hashPassword, comparePassword };
