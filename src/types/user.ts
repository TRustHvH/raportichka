export enum UserRole {
    STUDENT = 0,
    DUTY = 1,
    TEACHER = 2,
    ADMIN = 3
}

export interface User {
    id: number;
    username: string;
    role: UserRole;
}

export interface UserWithSession extends User {
    sessionToken: string;
} 