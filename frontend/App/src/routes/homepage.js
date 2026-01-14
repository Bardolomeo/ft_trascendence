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
export function home(fastify_1, _a) {
    return __awaiter(this, arguments, void 0, function* (fastify, {}) {
        fastify.get("/", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const file = fs.readFileSync("./src/index.html", "utf-8");
            const response = new Response(file, {
                status: 200,
                headers: { "Content-Type": "text/html" },
            });
            yield reply.send(response);
        }));
    });
}
//# sourceMappingURL=homepage.js.map