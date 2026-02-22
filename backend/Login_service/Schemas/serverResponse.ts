export interface serverResponse {
    success: boolean;
    message: string;
    user?: {
        id: number | undefined;
        username: string | undefined;
        email?: string;
        two_factorAuth ?: {
            status: number;
            secret: string | null;
            tempSecret: string | null;
            timeStampToDeleteSecrets: number;
        };
    }
    url?: string | null;
}