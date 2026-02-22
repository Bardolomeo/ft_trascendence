import { FastifyInstance } from "fastify";
import { creationResponse } from "../Schemas/creationResponse";
import { createUser } from "../Database/addUser";
import database from "../Database/dataBase";
import { createUserData } from "../Schemas/createUserData";

export default async function createUserRoute(fastify: FastifyInstance) {
    fastify.post<{
        Body: createUserData;
        Reply: creationResponse;
    }>('/createUser', async (req, res) => {
        try {
            const userData = req.body;
            console.log('Received user creation request:', userData);
            const db = await database;
            await createUser(db, userData);  
            console.log('User created successfully');
            return res.code(201).send({
                success: true,
                message: 'User created successfully'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.code(500).send({
                success: false,
                message: 'Error creating user: ' + error
            });
        }
    });
}