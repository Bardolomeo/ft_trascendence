export interface User {
    id: number;
    username: string;
    email?: string;
    password_hash: string;
    two_factorAuth ?: {
        status: number;
        secret: string | null;
        tempSecret: string | null;
        timeStampToDeleteSecrets: number;
    }
}