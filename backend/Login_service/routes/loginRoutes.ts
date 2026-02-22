import { FastifyInstance } from 'fastify';
import { logingAttempt } from '../Schemas/logingAttempt';
import { serverResponse } from '../Schemas/serverResponse';
import { verifyPassword } from '../Database/verifyPass';
import database from '../Database/dataBase';
import sqlite3 from 'sqlite3';

function require2FAAuth(db: sqlite3.Database, userData: serverResponse | null): boolean {
    if (userData?.user?.two_factorAuth?.tempSecret) {
        db.run(`UPDATE users SET 
            TwoFa_status = 0,
            TwoFa_secret = NULL,
            TwoFaTempSecret = NULL,
            TwoFaTimeStamp = 0
            WHERE id = ?`, [userData.user.id], function(err) {
            if (err) {
                console.error('Error resetting 2FA to defaults:', err.message);
            }
        });
    }
    if (userData?.user?.two_factorAuth?.status) {
        return true;
    }
    return false;
}


export default async function loginRoutes(fastify: FastifyInstance) {
    fastify.post<{
        Body: logingAttempt;
        Reply: serverResponse;
    }>('/login', async (req, res) => {
        try {
            const userData = req.body;
            console.log('Received login request:', userData);
            const db = await database;
            const verificationResult = await verifyPassword(db, userData);
            if (!verificationResult) {
                return res.code(401).send({
                    success: false,
                    message: 'Invalid data or user not found'
                });
            }
            if (require2FAAuth(db, verificationResult)) {
                return res.code(200).send({
                    success: true,
                    message: 'Password verified. TOTP code is required for login.'
                });
            }
            return res.code(200).send({
                success: true,
                message: 'Login successful'
            });
        } catch (error) {
            console.error('Error during login:', error);
            return res.code(500).send({
                success: false,
                message: 'Error during login: ' + (error)
            });
        }});
    }