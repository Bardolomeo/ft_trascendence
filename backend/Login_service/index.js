"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({ logger: true });
server.get('/ping', async (request, reply) => {
    console.log(`Received request: ${JSON.stringify(request.query)}`);
    console.log(`Received reply: ${JSON.stringify(reply.headers)}`);
    return 'pong\n';
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        server.log.error(err);
        console.error('Error starting server:', err);
        process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
    console.log(`Server Listening at ${address}`);
});
