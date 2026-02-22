import sqlite3 from 'sqlite3';
import { updatePassKeyForm } from "../Schemas/update_key";
import { updatePassKey } from "../Database/update_passKey";
import { updateTimeStamp } from "../Database/update_timestamp";
import { getCurrentTime, checkTimeDifference } from "../utils/getTime";
import { update_2FASDB } from "../Database/update_2FA_status";

export function checkReset2FA(db: sqlite3.Database, receivedData: updatePassKeyForm, time: number): Promise<boolean> {
    return new Promise(async(resolve, reject) => {
        if (checkTimeDifference(getCurrentTime(), time, true)) {
            await updateTimeStamp(db, receivedData.id, 0);
            await update_2FASDB(db, { id: receivedData.id, enabled: 0 });
            await updatePassKey(db, {id: receivedData.id, passKey: null}, false);
            resolve(true)
        }
        resolve(false);
    })
}