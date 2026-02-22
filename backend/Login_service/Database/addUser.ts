import sqlite3 from 'sqlite3';
import { createUserData } from '../Schemas/createUserData';
import { validateUserData } from '../utils/Validations';
import { findUser } from './findUser';
import { hashPassword } from '../utils/hashVerify';

export async function createUser(db: sqlite3.Database, userData: createUserData): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const { username, email, password } = userData;
        const validationError = validateUserData(username, email, password);
        if (validationError) {
            reject(new Error(validationError));
            return;
        }
        try {
            const existingUser = await findUser(db, username, email);
            if (existingUser) {
                reject(new Error('Username or email already exists'));
                return;
            }
            const password_hash = await hashPassword(password);
            db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, 
                [username, email, password_hash],
                function(err) {
                    if (err) {
                        console.error('Error inserting new user:', err.message);
                        reject(err);
                    } else {
                        console.log('New user created with ID:', this.lastID);
                        resolve();
                    }
                }
            );
        } catch (createError) {
            console.error('Error creating user:', createError);
            reject(createError);
        }});
}