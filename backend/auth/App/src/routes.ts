
export async function login (fastifyInstance) {

  fastifyInstance.post('/login', async (request, reply) => 
        {
            const body = request.body;
            console.log(body);
            await reply.send(body);
        })
}

export async function register (fastifyInstance) {

  fastifyInstance.post('/register', async (request, reply) => 
        {
          
            const body = request.body;
            console.log(body);
            await reply.send(body);
        })
}