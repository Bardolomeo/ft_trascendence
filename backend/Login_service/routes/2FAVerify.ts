// here i should receive the code from the frontend, verify it and respond
import { FastifyInstance } from "fastify";
import { updatePassKeyForm } from "../Schemas/update_key";
import { serverResponse } from "../Schemas/serverResponse";
import database from "../Database/dataBase";
import { findUserById } from "../Database/findUser";
import { verify2FAToken } from "../utils/2FA_Ops";
import { updatePassKey } from "../Database/update_passKey";
import { checkReset2FA } from "../Database/checkReset2FA";
import { updateTimeStamp } from "../Database/update_timestamp";

export default async function verify2FA( fastify: FastifyInstance) {
    fastify.post<{
        Body: updatePassKeyForm;
        Reply: serverResponse;
    }>('/enable2FA/verify', async (req, res) => {
        try {
            const db = await database;
            const receivedData = req.body;
            const userData = await findUserById(db, receivedData.id);
            if (!userData || !userData.two_factorAuth?.tempSecret) {
                return res.code(404).send({
                    success: false,
                    message: 'User not found or 2FA temp secret not set'
                });
            }
            const isCodeValid = verify2FAToken(receivedData.passKey, userData.two_factorAuth.tempSecret);
            if (isCodeValid) {
                if (await checkReset2FA(db, receivedData, userData.two_factorAuth.timeStampToDeleteSecrets)) {
                    return res.code(400).send({
                        success: false,
                        message: 'The 2FA code has expired. Please generate a new one.'
                    });
                }
                const tempObject: updatePassKeyForm = {
                    id: receivedData.id,
                    passKey: userData.two_factorAuth.tempSecret
                };
                await updatePassKey(db, tempObject, false);
                await updateTimeStamp(db, receivedData.id, 0);
                return res.code(200).send({
                    success: true,
                    message: 'The 2FA code has been verified successfully'
                });
            }
            return res.code(400).send({
                success: false,
                message: 'Invalid 2FA code'
            });
            } catch (error) {
            console.error('Error verifying 2FA code:', error);
            return res.code(500).send({
                success: false,
                message: 'Error while verifying 2FA code: ' + error
            })
        }
    })
}