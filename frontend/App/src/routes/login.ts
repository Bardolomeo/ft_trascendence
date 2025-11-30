import type { FastifyReply, FastifyRequest } from "fastify";
import * as fs from 'fs';


export interface TypedRequestBody<T> extends FastifyRequest {
  body: T;
}

export type RegisterFormBody = {
  username: string,
  password: string,
  confirmPassword: string,
}

export async function getLogin(fastify: any, {}) {
  await fastify.get("/login", async (req: FastifyRequest, reply: FastifyReply) => {
    const file = fs.readFileSync("./src/login.html", "utf-8");
    const response = new Response(file, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
    await reply.send(response);
  });
}

export async function postLogin(fastify: any, {}) {
  await fastify.post(
    "/login",
    async (
      request: TypedRequestBody<{ username: string; password: string }>,
      reply: FastifyReply
    ) => {
      const body = request.body;
      const { username, password } = body;
      const response = await fetch("https://nginx/signin", {
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
        throw new Error(
          `Unexpected Error occurred: ${message} \n ${request.body}`
        );
      } else {
        console.log("there");
        await reply.send(response);
      }
    }
  );
}

export async function register(fastify: any, {}) {
  await fastify.post("/register", async (req: TypedRequestBody<RegisterFormBody>, reply: FastifyReply) => {
    const body = JSON.stringify(req.body);
    const response = await fetch("http://auth:3000/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });
    if (!response.ok) {
      const message = response.text();
      throw new Error(`Unexpected Error occurred: ${message}`);
    } else {
      await reply.send(response);
    }
  });
}
