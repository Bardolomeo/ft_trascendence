import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import { signIn, signUp } from './routes.ts';


const fastify = Fastify({
    logger: true
});

fastify.register(fastifyFormbody);


//routes
fastify.register(signIn);
fastify.register(signUp);


const start = async () => {
    try {
        await fastify.listen({port: 3000, host:"0.0.0.0"})
    } catch (err) {
        fastify.log.error(err);
    }
}

start();