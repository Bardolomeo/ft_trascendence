import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify' 
import * as fs from 'fs'; 

export async function test(fastify: FastifyInstance, {}) {
        await fastify.get("/test", async (req: FastifyRequest, reply: FastifyReply) =>   {
            const page = fs.readFileSync("./src/index_test.html", "utf-8");
            const response = new Response(page, {
                headers: {"Content-Type" : "text/html"},
                status: 200,
            })
            await reply.send(response);
        }
    )
}