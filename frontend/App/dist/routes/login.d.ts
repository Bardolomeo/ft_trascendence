import type { FastifyRequest } from "fastify";
export interface TypedRequestBody<T> extends FastifyRequest {
    body: T;
}
export type RegisterFormBody = {
    username: string;
    password: string;
    confirmPassword: string;
};
export declare function getLogin(fastify: any, {}: {}): Promise<void>;
export declare function postLogin(fastify: any, {}: {}): Promise<void>;
export declare function register(fastify: any, {}: {}): Promise<void>;
//# sourceMappingURL=login.d.ts.map