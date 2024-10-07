import { hash, compare, genSalt } from 'bcryptjs';

const hashPassword = async (password: string) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
}

const comparePassword = async (inputPassword: string, storedPassword: string) => {
    const isValidPassword = await compare(inputPassword, storedPassword);
    return isValidPassword;
}


export { hashPassword, comparePassword };
