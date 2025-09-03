import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { home, auth, test, postLogin } from "./routes.ts";
import path from 'path';
import fastifyFormbody from '@fastify/formbody';



const fastify = Fastify({
    logger: true
});

fastify.register(fastifyFormbody);

const __dirname = path.resolve(path.dirname(""));

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/public/"),
    prefix: "/public/"
})

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/scripts/"),
    prefix: "/scripts/",
    decorateReply: false
})

//routes
fastify.register(home);
fastify.register(auth);
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