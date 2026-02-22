// assign passkey to the database
// copy temp secret to secret and delete temp secret

import sqlite3 from 'sqlite3';
import { updatePassKeyForm } from '../Schemas/update_key';

export async function updatePassKey(db: sqlite3.Database, update: updatePassKeyForm, isTemp: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
        const {id, passKey} = update;
        if (isTemp) {
            console.log('istemp');
            db.run(`UPDATE users SET TwoFaTempSecret = ? WHERE id = ?`,
            [passKey, id],
            function(err) {
                if (err){
                    reject(err);
                }
                resolve();
            });
        } else {
        console.log('is not temp');
        db.run(`UPDATE users SET TwoFa_secret = ?, TwoFaTempSecret = NULL WHERE id = ?`,
        [passKey, id],
        function(err) {
            if (err){
                reject(err);
            }
            resolve();
        });
        }});
}