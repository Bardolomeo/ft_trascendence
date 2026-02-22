// create secret key for 2FA function
// verify 2FA token TOTP with speakeasy function
// create a QR Code function

import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export function generate2FASecret(username: string): speakeasy.GeneratedSecret {
    const secret = speakeasy.generateSecret({
        name: `Trascendence (${username})`
    });
    console.log(secret.otpauth_url);
    return secret;
}

export function verify2FAToken(token: string | null, secret: string | null): boolean {
    if (!token || !secret) {
        return false;
    }
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1

    });
}

export async function generateQRCode(otpauthUrl: string): Promise<string> {
    try {
        const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);
        return qrCodeDataURL;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
}
