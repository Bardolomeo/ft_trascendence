import { FastifyInstance } from 'fastify';
// later add fastify, FastifyRequest, FastifyReply for more detailed typing and error checking
// TypeScript interfaces for request/response typing
interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        username: string;
    };
}

// Login routes plugin - this function gets registered with server.register()
export default async function loginRoutes(fastify: FastifyInstance) {
    // POST route to handle login from frontend
    fastify.post<{
        Body: LoginRequest;
        Reply: LoginResponse;
    }>('/login', async (request, reply) => {
        const { username, password } = request.body;
        
        console.log(`Login attempt - Username: ${username}, Password: ${password}`);
        
        
        // TODO: query the database to verify credentials here
        // For now, just return success response
        return reply.code(200).send({
            success: true,
            message: 'Credentials received successfully',
            user: {
                id: 1,
                username: username
            }
        });
    });
}
