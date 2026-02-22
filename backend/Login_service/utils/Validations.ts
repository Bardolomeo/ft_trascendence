// it is better to do a seperate function for each
export function validateUserData(username?: string, email?: string, password?: string): string | null {
    if (!username && !email && !password) {
        return 'At least one field (username, email, or password) must be provided';
    }
    if (password && password.length < 8) {
        return 'Password must be at least 8 characters long';
    } if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        } else if (email.length > 254) {
            return 'Email address too long';
        }
    } if (username && username.length > 30) {
        return 'Username too long';
    }
    return null;
}
//export async function validatePassword()