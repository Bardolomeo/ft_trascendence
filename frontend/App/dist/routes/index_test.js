import * as fs from 'fs';
export async function test(fastify, {}) {
    await fastify.get("/test", async (req, reply) => {
        const page = fs.readFileSync("./src/index_test.html", "utf-8");
        const response = new Response(page, {
            headers: { "Content-Type": "text/html" },
            status: 200,
        });
        await reply.send(response);
    });
}
//# sourceMappingURL=index_test.js.map