import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as fs from 'fs';

export async function home(fastify: FastifyInstance, {}) {
fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const file = fs.readFileSync("./src/index.html", "utf-8");
    const response = new Response(file, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
    await reply.send(response);
  });
}