import sqlite3 from 'sqlite3';
import { update2FAStatus } from '../Schemas/update_2FAStatus';
import { updateTimeStamp } from './update_timestamp';
import { update_2FASDB } from './update_2FA_status';
import { updatePassKeyForm } from '../Schemas/update_key';
import { updatePassKey } from './update_passKey';
import { generate2FASecret, generateQRCode } from '../utils/2FA_Ops';
import { getCurrentTime } from '../utils/getTime';
import { User } from '../Schemas/User';

export async function update2FAStatusDB(db: sqlite3.Database, update: update2FAStatus, user: User): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
        const passKeyUpdate: updatePassKeyForm = {
            id: update.id,
            passKey: null
        };
        console.log('user.two_factorAuth?.status:', user.two_factorAuth?.status);
        console.log('update.enabled:', update.enabled);
        if (user.two_factorAuth?.status == update.enabled) {
            return resolve(null);
        }
        if (Number(update.enabled) === 1) {
            const secret = generate2FASecret(user.username);
            if (!secret.otpauth_url) {
                reject(new Error('Failed to generate OTP auth URL'));
                return;
            }
            passKeyUpdate.passKey = secret.base32;
            await updatePassKey(db, passKeyUpdate, true);
            await update_2FASDB(db, update);
            await updateTimeStamp(db, update.id, getCurrentTime());
            const qrCodeDataURL = await generateQRCode(secret.otpauth_url);
            resolve(qrCodeDataURL);
        } else {
            await updateTimeStamp(db, update.id, 0);
            await update_2FASDB(db, update);
            await updatePassKey(db, passKeyUpdate, false);
            resolve(null);
        }
        reject('It should never reach here');
    })
}