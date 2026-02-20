import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import path from 'path';
import { listComponents, routesAllGet } from './routes/routes_all_get.ts';
import { postLogin, register } from './routes/login.ts';



export const fastify = Fastify({
    logger: true
});


fastify.register(fastifyFormbody);

const __dirname = path.resolve(path.dirname(""));

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/public/"),
    prefix: "/public/"
})


fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/scripts/"),
    prefix: "/scripts/",
		decorateReply: false
})

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/orchestrator/"),
    prefix: "/orchestrator/",
    decorateReply: false
})


//routes
fastify.register(routesAllGet);
fastify.register(postLogin);
fastify.register(register);
fastify.register(listComponents);

const pwd = process.env.pwd

const start = async () => {
    try {
        await fastify.listen({port: 3000, host:(pwd === "/App" ? "frontend" : "0.0.0.0")})
    } catch (err) {
        fastify.log.error(err);
    }
}

start();
