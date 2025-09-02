import Fastify from 'fastify';
//import { home, login, test, postLogin } from "./routes.ts";
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import path from 'path';


const fastify = Fastify({
    logger: true
});

fastify.register(fastifyFormbody);

const __dirname = path.resolve(path.dirname(""));

//routes
fastify.register(home);
fastify.register(login);
fastify.register(test);
fastify.register(postLogin);


const start = async () => {
    try {
        await fastify.listen({port: 3000, host:"0.0.0.0"})
    } catch (err) {
        fastify.log.error(err);
    }
}

start();