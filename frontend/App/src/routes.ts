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
}

export async function test (fastify, options) {
  await fastify.get('/test', async (request, reply) => 
        {
            const file = fs.readFileSync('./src/test.html', 'utf-8');
            const response = new Response(file, {
            status: 200,
            headers: {'Content-Type': 'text/html'}
            },); 
            await reply.send(response);
        })
}

export async function postLogin (fastify, options) {
  await fastify.post('/login', (request, reply) => 
        {
          reply.send(request.body);
        })
}