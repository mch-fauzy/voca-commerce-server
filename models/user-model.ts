import { voca_role as Role } from "@prisma/client";

// Read-only property
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
} as const;

interface User {
    id: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date | null;
    deletedBy: string | null;
}

type UserPrimaryId = Pick<User, 'id'>;

// Other fields either auto generated (like createdAt and updatedAt) or nullable (like deletedAt and deletedBy)
type CreateUser = Pick<User, 'id' | 'email' | 'password' | 'role' | 'createdBy' | 'updatedBy'>

export {
    Role,
    USER_DB_FIELD,
    User,
    UserPrimaryId,
    CreateUser,
};
