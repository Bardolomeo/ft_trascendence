import fastify from 'fastify';
import db from './Database/dataBase';

const startServer = async () => {
    try {
        const database = await db;
        console.log('Database initialized successfully:', database);
        const server = fastify({ logger: true });
        //Here i should add the CORS plugin to allow requests from the frontend otherwise it will get bloacked by browser
        // then add all the routes and handlers for login and registration as API endpoints
        // options for endpoints are (login with GOOGLE, login with email and password, create new account)
        // for google login, I should implement OAuth flow
        // for email and password, I should check the database for existing users
        // for creating a new account, I should insert the new user into the database
        
        server.listen( {port: 8080}, (err, address) => {
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

// interface IQuerystring {
//     username: string;
//     password: string;
// }

// interface IHeaders {
//     'h-Custom': string;
// }

// interface IReply {
//     200: {success: boolean};
//     302: { url: string };
//     404: { error: string };
// }

// server.get<{
//     Querystring: IQuerystring;
//     Headers: IHeaders;
//     Reply: IReply;
// }>('/auth', async (req, reply) => {
//     const { username, password } = req.query;
//     const customHeader = req.headers['h-Custom'];

//     console.log(`Received request with username: ${username}, password: ${password}, custom header: ${customHeader}`);
//     if (username === 'admin' && password === 'password') {
//         return reply.code(200).send({ success: true });
//     } else if (username === 'redirect') {
//         return reply.code(302).send({ url: 'https://example.com' });
//     } else {
//         return reply.code(404).send({ error: 'Not Found' });
//     }
// })

// server.get('/', async (request, reply) => {
//     console.log(`Received request: ${JSON.stringify(request.query)}`);
//     console.log(`Received reply: ${JSON.stringify(reply.headers)}`)
//     return { message: 'pong'};
// });


