import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

const DATA_DIR = './data';
const DB_PATH = path.join(DATA_DIR, 'database.db');
const BACKUP_SERVICE_URL = 'http://backup-service:3001';

// Function to request database from backup service
const requestDatabaseFromBackup = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('📥 Requesting database from backup service...');
        
        const req = http.get(`${BACKUP_SERVICE_URL}/get-database`, (res) => {
            if (res.statusCode === 200) {
                // Ensure data directory exists
                if (!fs.existsSync(DATA_DIR)) {
                    fs.mkdirSync(DATA_DIR, { recursive: true });
                    console.log('📁 Created data directory');
                }
                
                const writeStream = fs.createWriteStream(DB_PATH);
                res.pipe(writeStream);
                
                writeStream.on('finish', () => {
                    console.log('✅ Database received and saved to Login_service/data/');
                    resolve();
                });
                
                writeStream.on('error', (err) => {
                    console.error('❌ Error saving database:', err);
                    reject(err);
                });
            } else {
                console.log('⚠️ No database available from backup service');
                resolve(); // Continue without backup
            }
        });
        
        req.on('error', (err) => {
            console.log('⚠️ Could not reach backup service:', err.message);
            resolve(); // Continue without backup
        });
        
        req.setTimeout(5000, () => {
            console.log('⚠️ Backup service request timed out');
            req.destroy();
            resolve(); // Continue without backup
        });
    });
};

const dbInitialized = new Promise<sqlite3.Database>(async (resolve, reject) => {
    try {
        // Always request database from backup service
        await requestDatabaseFromBackup();
        
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
                    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
                        if (err) {
                            console.error('❌ Error checking for users table:', err.message);
                            reject(err);
                        } else if (!row) {
                            // No users table - create it
                            console.log('📋 No users table found - creating it...');
                            db.run(`CREATE TABLE users (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username TEXT NOT NULL UNIQUE,
                                password TEXT NOT NULL
                            )`, (err) => {
                                if (err) {
                                    console.error('❌ Error creating users table:', err.message);
                                    reject(err);
                                } else {
                                    console.log('✅ Users table created successfully.');
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