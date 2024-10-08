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
    email: string;
    role: Role;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date;
    deletedBy: string;
}

export { CreateUser, UserData, Role };
