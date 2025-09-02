import fs from 'fs';
import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';


const fastify = Fastify({logger:true}); 
fastify.register(fastifyFormbody);


export async function home (fastify, options) {
  fastify.post('/login', async (request, reply) => 
        {
            const body = request.body;
            console.log(body);
            const response = new Response(body, {
            status: 200,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            await reply.send(response);
        })
}