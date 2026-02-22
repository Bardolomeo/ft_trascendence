export interface creationResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        email?: string;
        username: string;
    }
}