// better way for next time, i could have always passed to my getters and setters, the user object
// found in the database, instead of sending the database session itself.
// so i do all the checks in one place in the deepest layer of the code

import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import db from './Database/dataBase';
import createUserRoute from './routes/createUser';
import loginRoutes from './routes/loginRoutes';
import updateUserRoute from './routes/updateUser';
import deleteRoute from './routes/deleteRoute';
import enable2FA  from './routes/enable2FA';
import verify2FA from './routes/2FAVerify';
import loginVerify from './routes/loginVerify';

const startServer = async () => {
    try {
        const database = await db;
        console.log('Database initialized successfully:', database);
        const server = fastify({ logger: true });
        
        // This plugin is important for handling communication between frontend and backend and
        // avoid browser blocking communication between frontend and backend
        //await server.register(import('@fastify/cors'), {
        //    origin: true, // restrict me later
        //    methods: ['GET', 'POST', 'PUT', 'DELETE']
        //});

        // Register login routes
        //await server.register(loginRoutes);
        await server.register(createUserRoute);
        await server.register(loginRoutes);
        await server.register(updateUserRoute);
        await server.register(deleteRoute);
        await server.register(enable2FA);
        await server.register(verify2FA);
        await server.register(loginVerify);
        //route to delete 2fa from secret

        // Health check route
        server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
            return { 
                message: 'Login Service is running',
                status: 'healthy',
                timestamp: new Date().toISOString()
            };
        });
        
        server.listen({port: 8080, host: '0.0.0.0'}, (err: Error | null, address: string) => {
            if (err) {
                server.log.error(err);
                console.error('Error starting server:', err);
                process.exit(1);
            }
            server.log.info(`Server listening at ${address}`);
            console.log(`Server Listening at ${address}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();