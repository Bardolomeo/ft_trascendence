import fastify from 'fastify';
import db from './Database/dataBase';
import loginRoutes from './routes/loginRoutes';

const startServer = async () => {
    try {
        const database = await db;
        console.log('Database initialized successfully:', database);
        const server = fastify({ logger: true });
        
        // This plugin is important for handling communication between frontend and backend and
        // avoid browser blocking communication between frontend and backend
        await server.register(import('@fastify/cors'), {
            origin: true, // restrict me later
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        });

        // Register login routes
        await server.register(loginRoutes);

        // Health check route
        server.get('/', async (request, reply) => {
            return { 
                message: 'Login Service is running',
                status: 'healthy',
                timestamp: new Date().toISOString()
            };
        });
        
        server.listen( {port: 3000, host: 'login-service'}, (err, address) => {
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