// make it zero, or assign
// get timestamp function (not needed coz it will be inside USER object anyway)

import sqlite3 from 'sqlite3';

export async function updateTimeStamp(db: sqlite3.Database, id: number, timeStamp: number): Promise<void> {
    return new Promise ((resolve, reject) => {
        db.run(`UPDATE users SET TwoFaTimeStamp = ? WHERE id = ?`,
            [timeStamp, id],
            function(err) {
                if (err){
                    reject(err);
                }
                resolve();
            });
    });
}