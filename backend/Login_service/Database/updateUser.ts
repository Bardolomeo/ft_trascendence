import sqlite3 from "sqlite3";
import { User } from "../Schemas/User";
import { findUserById } from "./findUser";
import { validateUserData } from "../utils/Validations";
import { updateForm } from "../Schemas/updateForm";
import { findUser } from "./findUser";
import { hashPassword } from "../utils/hashVerify";
import { verifyPassword } from "../utils/hashVerify";

function validateUserField(oldValue: string | undefined, newValue: string): string | null {
    if (newValue == oldValue) {
        throw new Error('New value cannot be the same as the old value');
    }
    console.log('new value:', newValue, 'old value:', oldValue);
    console.log('Value is different - validation passed');
    return null;
}

async function validateSameAsOld(user: User, update: updateForm): Promise<string | null> {
    const { username, email, newpassword } = update;
    try {
        if (newpassword) {
            const passMatch = await verifyPassword(newpassword, user.password_hash);
            if (passMatch) {
                return 'New password cannot be the same as the old password';
            }
            const password_hash = await hashPassword(newpassword);
            user.password_hash = password_hash;
        }
        if (username && !validateUserField(user.username, username)) {
            user.username = username;
        }
        if (email && !validateUserField(user.email, email)) {
            user.email = email;
        }
        return null;
    } catch (error) {
        console.error('Error validating update data:', error);
        return 'Error validating update data';
    }
}

export async function updateUser(db: sqlite3.Database, user: updateForm): Promise<User> {
    return new Promise (async (resolve, reject) => {
        const {id, password, username, email, newpassword } = user;
        const validationError = validateUserData(username, email, newpassword);
        if (validationError) {
            reject(new Error(validationError));
            return;
        }
        try {
            // the code below can be put in a seperate helper functions
            //get the original data for the user
            const existingUser = await findUserById(db, id);
            if (!existingUser) {
                reject(new Error('User not found'));
                return;
            }
            // security verification, password required to edit.
            const passMatch = await verifyPassword(password, existingUser.password_hash);
            if (!passMatch) {
                reject(new Error('Incorrect password'));
                return;
            }
            //validate that new data does not already exist for another user. put in another file
            const checkUsername = username ? await findUser(db, username) : null;
            if (checkUsername && checkUsername.id !== id) {
                reject(new Error('Username already exists'));
                return;
            }
            const checkEmail = email ? await findUser(db, existingUser.username, email) : null;
            if (checkEmail && checkEmail.id !== id) {
                reject(new Error('Email already exists'));
                return;
            }
            let updatedUser: User = {...existingUser};
            //validate the new data is not like old data
            const updateError = await validateSameAsOld(updatedUser, user);
            if (updateError) {
                reject(new Error(updateError));
                return;
             }
            //update the user in the database
            db.run(`UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?`,
                [updatedUser.username, updatedUser.email, updatedUser.password_hash, id],
                function(err) {
                    if (err) {
                        console.error('Error updating user:', err.message);
                        reject(err);
                    } else {
                        console.log('User updated with ID:', id);
                        resolve(updatedUser);
                    }
                }
            );
        } catch (updateError) {
            console.error('Error updating user:', updateError);
            reject(updateError);
        }
    });
}