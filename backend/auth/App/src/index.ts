import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import { login, register } from './routes.ts';


const fastify = Fastify({
    logger: true
});

fastify.register(fastifyFormbody);


//routes
fastify.register(login);
fastify.register(register);


const start = async () => {
    try {
        await fastify.listen({port: 3000, host:"0.0.0.0"})
    } catch (err) {
        fastify.log.error(err);
    }
}

start();