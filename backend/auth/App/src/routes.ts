
import qs from 'querystring';

export async function signIn (fastifyInstance) {

  fastifyInstance.post('/signIn', async (request: Request, reply) => 
        {
            if (request.headers.get("Content-Type") !== "application/x-www-form-urlencoded")
                reply.send(403);
            const body = qs.parse(request.body);
            const response = new Response(body, {
              status: 200,
              headers: {"Content-Type": "application/json"},
            })
            await reply.send(response);
        })
}

export async function signUp (fastifyInstance) {

  fastifyInstance.post('/signUp', async (request, reply) => 
        {
            const body = JSON.stringify(request.body);
            const response = new Response(body, {
              status: 200,
              headers: {"Content-Type": "application/json"},
            })
            await reply.send(response);
        })
}