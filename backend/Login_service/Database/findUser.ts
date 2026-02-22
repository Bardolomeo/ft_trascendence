import sqlite3 from 'sqlite3';
import { User } from '../Schemas/User';

export async function findUser(db: sqlite3.Database, username: string, email?: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE username = ? OR email = ?`,
            [username, email],
            (err, row: any) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const user: User = {
                        id: row.id,
                        username: row.username,
                        email: row.email,
                        password_hash: row.password_hash,
                        two_factorAuth: {
                            status: row.TwoFa_status || 0,
                            secret: row.TwoFa_secret || null,
                            tempSecret: row.TwoFaTempSecret || null,
                            timeStampToDeleteSecrets: row.TwoFaTimeStamp || 0
                        }
                    };
                    resolve(user);
                }
            });
    });
}

export async function findUserById(db: sqlite3.Database, id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id = ?`,
            [id],
            (err, row: any) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const user: User = {
                        id: row.id,
                        username: row.username,
                        email: row.email,
                        password_hash: row.password_hash,
                        two_factorAuth: {
                            status: row.TwoFa_status || 0,
                            secret: row.TwoFa_secret || null,
                            tempSecret: row.TwoFaTempSecret || null,
                            timeStampToDeleteSecrets: row.TwoFaTimeStamp || 0
                        }
                    };
                    resolve(user);
                }
            });
    });
}