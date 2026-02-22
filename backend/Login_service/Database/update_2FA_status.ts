// update the status of 2FA in database
// i dont need a getter, the whole USER Schema will be imported which includes the 2FA status

import sqlite3 from 'sqlite3';
import { update2FAStatus } from '../Schemas/update_2FAStatus';

export async function update_2FASDB(db: sqlite3.Database, update: update2FAStatus): Promise<void> {
    return new Promise((resolve, reject) => {
        const {id, enabled} = update;
        db.run(`UPDATE users SET TwoFa_status = ? WHERE id = ?`,
            [enabled, id], 
            function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}