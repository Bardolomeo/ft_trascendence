import { FastifyInstance } from 'fastify';
import { deleteForm } from '../Schemas/deleteForm';
import { deleteUser } from '../Database/deleteUser';
import database from '../Database/dataBase';
import { serverResponse } from '../Schemas/serverResponse';

export default async function deleteRoute( fastify : FastifyInstance){
    fastify.post<{
        Body: deleteForm;
        Reply: serverResponse;
    }>('/deleteUser', async (req, res) => {
        try {
            const userData = req.body;
            console.log('Received user deletion request:', userData);
            const db = await database;
            await deleteUser(db, userData);
            return res.code(200).send({
                success: true,
                message: 'User deleted successfully',
                user: {
                    id: userData.id,
                    username: 'Deleted User'
                }
            });
        } catch (error) {
            console.error('Error during user deletion:', error);
            return res.code(500).send({
                success: false,
                message: 'Error during user deletion: ' + (error)
            });
        }
    });
}