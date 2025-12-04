import * as fs from 'fs';
export async function home(fastify, {}) {
    fastify.get("/", async (req, reply) => {
        const file = fs.readFileSync("./src/index.html", "utf-8");
        const response = new Response(file, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
        await reply.send(response);
    });
}
//# sourceMappingURL=homepage.js.map