import sqlite3 from 'sqlite3';
import { findUser } from './findUser';
import bcrypt from 'bcrypt';
import { serverResponse } from '../Schemas/serverResponse';
import { logingAttempt } from '../Schemas/logingAttempt';

export async function verifyPassword(db: sqlite3.Database, user: logingAttempt): Promise< serverResponse | null> {
    return new Promise(async (resolve, reject) => {
        const {username, email, password} = user;
    try {
        const existingUser = await findUser(db, username, email);
        if (!existingUser) {
            reject(new Error('User not found'));
            return;
        }
        const passMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!passMatch) {
            reject(new Error('Incorrect password'));
            return;
        }
        const response: serverResponse = {
            success: true,
            message: 'Password verified successfully',
            user: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                two_factorAuth: existingUser.two_factorAuth ? {
                    status: existingUser.two_factorAuth.status,
                    secret: existingUser.two_factorAuth.secret,
                    tempSecret: existingUser.two_factorAuth.tempSecret,
                    timeStampToDeleteSecrets: existingUser.two_factorAuth.timeStampToDeleteSecrets
                } : undefined
            }
        };
        resolve(response);
    } catch (error) {
        console.error('Error verifying password:', error);
        reject(new Error('Error verifying password'));
        return;
    }});
}