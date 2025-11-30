import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { getLogin, home, postLogin, register } from "./routes.ts";
import path from 'path';
import fastifyFormbody from '@fastify/formbody';


console.log("hello");

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
fastify.register(getLogin);
fastify.register(postLogin);
fastify.register(register);
fastify.register(test);
fasti

const start = async () => {
    try {
        await fastify.listen({port: 3000, host:"0.0.0.0"})
        // await fastify.listen({port: 3000, host:"frontend"})
    } catch (err) {
        fastify.log.error(err);
    }
}

start();
