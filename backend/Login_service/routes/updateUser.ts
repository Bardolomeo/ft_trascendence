import { FastifyInstance } from "fastify";
import { updateForm } from "../Schemas/updateForm";
import database from "../Database/dataBase";
import { updateUser } from "../Database/updateUser";
import { creationResponse } from "../Schemas/creationResponse";

export default async function updateUserAccountRoute(fastify: FastifyInstance) {
    fastify.put<{
        Body: updateForm;
        Reply: creationResponse;
    }>('/updateUser', async (req, res) => {
        const updateData = req.body;
        console.log('Received user update request:', updateData);
        try {
            const db = await database;
            const updatedUser = await updateUser(db, updateData);
            console.log('User updated successfully');
            return res.code(200).send({
                success: true,
                message: 'User updated successfully',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    username: updatedUser.username
                }
            });
        } catch (error) {
            console.error('Error:', error);
            return res.code(500).send({
                success: false,
                message: 'Error: ' + error
            });
        }
    });
}