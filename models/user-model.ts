import { voca_role as Role } from "@prisma/client";

const USER_DB_FIELD = {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
}

// Other fields either auto generated (like createdAt and updatedAt) or nullable (like deletedAt and deletedBy)
interface CreateUser {
    id: string;
    email: string;
    password: string;
    role: Role;
    createdBy: string;
    updatedBy: string;
}

export {
    USER_DB_FIELD,
    CreateUser,
    Role
};
