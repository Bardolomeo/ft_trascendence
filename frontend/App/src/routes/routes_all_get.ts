import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import findPage  from "../orchestrator/orchestrator.ts";


//remember that defined route have precedence over wildcard
export async function routesAllGet(fastify: FastifyInstance, {}) {
fastify.get("/*", async (req: FastifyRequest, reply: FastifyReply) => {
		const route = req.url;
    const response = new Response(findPage(route), {
      status: 200,
      headers: { "Content-Type": route === "/favicon.ico" ? "image/x-icon" : "text/html" },
    });
    await reply.send(response);
  });
}

export async function listComponents(fastify: FastifyInstance, {}) {
fastify.get("/orchestrator", async (req: FastifyRequest, reply: FastifyReply) => {
		const orchestratorListing = fs.readdirSync("./src/orchestrator", {recursive: true});
    const response = new Response(JSON.stringify(orchestratorListing), {
      status: 200,
      headers: { "Content-Type": "text/json" },
    });
    await reply.send(response);
  });
}
