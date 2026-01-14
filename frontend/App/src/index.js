var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import path from 'path';
import { home } from './routes/homepage.js';
import { getLogin, postLogin, register } from './routes/login.js';
export const fastify = Fastify({
    logger: true
});
fastify.register(fastifyFormbody);
const __dirname = path.resolve(path.dirname(""));
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/public/"),
    prefix: "/public/"
});
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/scripts/"),
    prefix: "/scripts/",
    decorateReply: false
});
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/components/"),
    prefix: "/components/",
    decorateReply: false
});
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "/src/components/"),
    prefix: "/components-html/",
    decorateReply: false
});
//routes
fastify.register(home);
fastify.register(getLogin);
fastify.register(postLogin);
fastify.register(register);
const pwd = process.env.pwd;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.listen({ port: 3000, host: (pwd === "/App" ? "frontend" : "0.0.0.0") });
        //await fastify.listen({port: 3000, host:"frontend"})
    }
    catch (err) {
        fastify.log.error(err);
    }
});
start();
//# sourceMappingURL=index.js.map