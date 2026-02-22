import sqlite3 from 'sqlite3';
import { deleteForm } from '../Schemas/deleteForm';
import { findUserById } from './findUser';
import { verifyPassword } from '../utils/hashVerify';

export async function deleteUser(db: sqlite3.Database, user: deleteForm): Promise<void> {
    return new Promise (async (resolve, reject) => {
        const { id, password } = user;
        try {
            const existingUser = await findUserById(db, id);
            if (!existingUser) {
                return reject(new Error('User not found?)'));
            }
            const passVerify = await verifyPassword(password, existingUser.password_hash);
            if (! passVerify) {
                return reject(new Error('Incorrect password'));
            }
            db.run(`DELETE FROM users WHERE id =?`, [id], function(err) {
                if (err){
                    return reject(new Error('Error deleting user: ' + err.message));
                }
                resolve();
            });    
        } catch (error) {
            return reject(error);
        }
    });
}