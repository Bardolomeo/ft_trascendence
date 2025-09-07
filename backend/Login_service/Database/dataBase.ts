import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as http from 'http';

const DB_PATH = './Database/database.db';
const BACKUP_SERVICE_URL = 'http://backup-service:3001';

// Simple function to get database from backup service
const getDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('📥 Requesting database from backup service...');
        
        const req = http.get(`${BACKUP_SERVICE_URL}/get-database`, (res) => {
            if (res.statusCode === 200) {
                const writeStream = fs.createWriteStream(DB_PATH);
                res.pipe(writeStream);
                
                writeStream.on('finish', () => {
                    console.log('✅ Database received from backup service');
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
        // Step 1: Try to get database from backup service
        await getDatabase();
        
        // Step 2: Connect to database (create if doesn't exist)
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database ' + err.message);
                reject(err);
            } else {
                console.log('Connected to the SQLite database.');
                
                // Step 3: Check if database has users table (if empty, give error)
                db.serialize(() => {
                    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
                        if (err) {
                            console.error('Error checking for users table: ' + err.message);
                            reject(err);
                        } else if (!row) {
                            // Database is empty - give error
                            console.error('❌ Database is empty! No users table found.');
                            reject(new Error('Database is empty - no users table exists'));
                        } else {
                            console.log('✅ Users table found in database.');
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