import { sign } from "jsonwebtoken";

import { UserData } from "../models/user-model";
import { CONFIG } from "../configs/config";
import { CONSTANTS } from "./constants";

const generateToken = (data: Pick<UserData, 'id' | 'role'>) => {
    const token = sign(
        { id: data.id, role: data.role },
        String(CONFIG.APP.JWT_ACCESS_KEY),
        { expiresIn: CONSTANTS.JWT.EXPIRY });

    return token;
}

export { generateToken };
