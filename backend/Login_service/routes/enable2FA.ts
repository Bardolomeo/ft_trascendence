//handle 2 cases: when enable and when disable
import { FastifyInstance} from "fastify";
import { update2FAStatus } from "../Schemas/update_2FAStatus";
import { serverResponse } from "../Schemas/serverResponse";
import database from "../Database/dataBase";
import { findUserById } from "../Database/findUser";
import { update2FAStatusDB } from "../Database/update2FAStatusDB";


export default async function enable2FA(fastify: FastifyInstance) {
    fastify.post<{
        Body: update2FAStatus;
        Reply: serverResponse;
    }>('/enable2FA', async (req, res) => {
        try {
            const db = await database;
            const receivedData = req.body;
            const userData = await findUserById(db, receivedData.id);
            if (!userData) {
                return res.code(404).send({
                    success: false,
                    message: 'User not found'
                })
            }
            //Time gap between changes check. or maximum number of changes in a time frame. future improvement
            const updateProcess: string | null = await update2FAStatusDB(db, receivedData, userData);
            if (updateProcess) {
                return res.code(200).send({
                    success: true,
                    message: `2FA pass has been generated successfully`,
                    url: updateProcess  
                });
            } else {
                return res.code(200).send({
                    success: true,
                    message: `2FA has been updated successfully`
            });
            }} catch (error) {
            console.error('Error updating 2FA status:', error);
            return res.code(500).send({
                success: false,
                message: 'Error while updating 2FA status: ' + error
            })
        }
    })
}