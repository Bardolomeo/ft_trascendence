import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const rounds = 10;
    return await bcrypt.hash(password, rounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}