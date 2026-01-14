var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
export function getLogin(fastify_1, _a) {
    return __awaiter(this, arguments, void 0, function* (fastify, {}) {
        yield fastify.get("/login", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const file = fs.readFileSync("./src/login.html", "utf-8");
            const response = new Response(file, {
                status: 200,
                headers: { "Content-Type": "text/html" },
            });
            yield reply.send(response);
        }));
    });
}
export function postLogin(fastify_1, _a) {
    return __awaiter(this, arguments, void 0, function* (fastify, {}) {
        yield fastify.post("/login", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { username, password } = body;
            const response = yield fetch("https://nginx/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            if (!response.ok) {
                const message = response.text();
                throw new Error(`Unexpected Error occurred: ${message} \n ${request.body}`);
            }
            else {
                console.log("there");
                yield reply.send(response);
            }
        }));
    });
}
export function register(fastify_1, _a) {
    return __awaiter(this, arguments, void 0, function* (fastify, {}) {
        yield fastify.post("/register", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify(req.body);
            const response = yield fetch("http://auth:3000/signUp", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: body,
            });
            if (!response.ok) {
                const message = response.text();
                throw new Error(`Unexpected Error occurred: ${message}`);
            }
            else {
                yield reply.send(response);
            }
        }));
    });
}
//# sourceMappingURL=login.js.map