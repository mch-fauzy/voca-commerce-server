import { voca_role as Role } from "@prisma/client";

interface CreateUser {
    id: string;
    email: string;
    password: string;
    role: Role;
    createdBy: string;
    updatedBy: string;
}

interface UserData {
    id: string;
    role: Role;
}

export { CreateUser, UserData, Role };
