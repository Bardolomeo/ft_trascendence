import { FastifyInstance } from "fastify";
import { serverResponse } from "../Schemas/serverResponse";
import { updatePassKeyForm } from "../Schemas/update_key";
import database from "../Database/dataBase";
import { findUserById } from "../Database/findUser";
import { verify2FAToken } from "../utils/2FA_Ops";


export default function loginVerify (fastify: FastifyInstance) {
    fastify.post<{
        Body: updatePassKeyForm;
        Reply: serverResponse;
    }>('/login/verify', async (req, res) => {
        try {
            const receivedData = req.body;
            const db = await database;
            const userData = await findUserById(db, receivedData.id);
            if (!userData) {
                return res.code(404).send({
                    success: false,
                    message: 'User not found'
                });
            }
            const isCodeValid = verify2FAToken(receivedData.passKey, userData?.two_factorAuth?.secret || null);
            if (isCodeValid) {
                return res.code(200).send({
                    success: true,
                    message: 'Login successful'
                });
            }
            return res.code(400).send({
                success: false,
                message: 'Invalid 2FA code'
            });
        } catch (error) {
            console.error('Error during login verification:', error);
            return res.code(500).send({
                success: false,
                message: 'Error during login verification: ' + error
            });
        }
    })
}