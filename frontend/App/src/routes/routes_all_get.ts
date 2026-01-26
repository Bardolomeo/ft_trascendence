import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import findPage, { handleLoad } from "../components/orchestrator.ts";


//remember that defined route have precedence over wildcard
export async function routesAllGet(fastify: FastifyInstance, {}) {
fastify.get("/*", async (req: FastifyRequest, reply: FastifyReply) => {
		const route = req.url;
    const response = new Response(findPage(route), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
    await reply.send(response);
		await handleLoad(route);
  });
}

export async function listComponents(fastify: FastifyInstance, {}) {
fastify.get("/components", async (req: FastifyRequest, reply: FastifyReply) => {
		const componentsListing = fs.readdirSync("./src/components", {recursive: true});
    const response = new Response(JSON.stringify(componentsListing), {
      status: 200,
      headers: { "Content-Type": "text/json" },
    });
    await reply.send(response);
  });
}
