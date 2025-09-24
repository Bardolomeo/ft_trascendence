import fs from 'fs';
import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';


const fastify = Fastify({logger:true}); 
fastify.register(fastifyFormbody);


export async function home (fastify, options) {
  fastify.get('/', async (request, reply) => 
        {
            const file = fs.readFileSync('./src/index.html', 'utf-8');
            const response = new Response(file, {
            status: 200,
            headers: {'Content-Type': 'text/html'}
            });
            await reply.send(response);
        })
}


export async function login (fastify, options) {
  await fastify.get('/login', async (request, reply) => 
        {
            const file = fs.readFileSync('./src/login.html', 'utf-8');
            const response = new Response(file, {
            status: 200,
            headers: {'Content-Type': 'text/html'}
            });
            await reply.send(response);

          })

    await fastify.post('/login', async (request: Request, reply) => 
      {

            const body = JSON.stringify(request.body);
            const response = await fetch("http://auth:3000/signIn", {
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              body: body,
            });
            if (!response.ok)
            {
              const message = response.text();
              throw new Error(`Unexpected Error occurred: ${message}`);
            } else {
              await reply.send(response);
            }
    })
}

export async function register (fastify, options) {
  await fastify.post('/register', async (request: Request, reply) => 
        {
            const body = JSON.stringify(request.body);
            const response = await fetch("http://auth:3000/signUp", {
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              body: body
            });
            if (!response.ok)
            {
              const message = response.text();
              throw new Error(`Unexpected Error occurred: ${message}`);
            } else {
              await reply.send(response);
            }
    }) 
}