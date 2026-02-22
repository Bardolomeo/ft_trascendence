import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = './data';
const DB_PATH = path.join(DATA_DIR, 'database.db');

const dbInitialized = new Promise<sqlite3.Database>(async (resolve, reject) => {
    try {
        // Step 2: Ensure data directory exists
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            console.log('📁 Created data directory');
        }
        
        // Step 3: Connect to database (will create new if doesn't exist)
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                reject(err);
            } else {
                console.log('✅ Connected to the SQLite database.');
                // Step 4: Check if users table exists, create if not
                db.serialize(() => {
                    const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`;
                    db.get(query, (err, row) => {
                        if (err) {
                            console.error('❌ Error checking for users table:', err.message);
                            reject(err);
                        } else if (!row) {
                            console.log('📋 No users table found - creating it...');
                            // it is better to seperate this into 2 different tables. for semplicity i will keep it in one table for now
                            db.run(`CREATE TABLE users (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                                email TEXT UNIQUE COLLATE NOCASE,
                                password_hash TEXT NOT NULL,
                                TwoFa_status INTEGER DEFAULT 0,
                                TwoFa_secret TEXT DEFAULT NULL,
                                TwoFaTempSecret TEXT DEFAULT NULL,
                                TwoFaTimeStamp INTEGER DEFAULT 0
                            )`, (err) => {
                                if (err) {
                                    console.error('❌ Error creating users table:', err.message);
                                    reject(err);
                                } else {
                                    console.log('✅ Users table created successfully.');
                                    
                                    // Create indexes for better query performance
                                    db.run(`CREATE INDEX idx_users_username ON users(username)`, (err) => {
                                        if (err) console.log('⚠️ Username index already exists or error:', err.message);
                                    });
                                    
                                    db.run(`CREATE INDEX idx_users_email ON users(email)`, (err) => {
                                        if (err) console.log('⚠️ Email index already exists or error:', err.message);
                                    });
                                    resolve(db);
                                }
                            });
                        } else {
                            // Users table exists
                            console.log('✅ Users table found - ready to use.');
                            resolve(db);
                        }
                    });
                });
            }
        });
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        reject(error);
    }
});

export default dbInitialized;