import * as fs from 'fs';
import * as http from 'http';

// Simple backup service that just sends database file when requested
const PORT = 3001;
const DATABASE_FILE = '/app/data/database.db';

const server = http.createServer((req, res) => {
    console.log(`� Request: ${req.method} ${req.url}`);

    // Allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/get-database' && req.method === 'GET') {
        // Send database file
        if (fs.existsSync(DATABASE_FILE)) {
            console.log('📤 Sending database file...');
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            const fileStream = fs.createReadStream(DATABASE_FILE);
            fileStream.pipe(res);
        } else {
            console.log('❌ Database file not found');
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Database file not found');
        }
    } else if (req.url === '/health') {
        // Health check
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backup service is running');
    } else {
        // Unknown endpoint
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Simple backup service running on port ${PORT}`);
    console.log(`📁 Database file: ${DATABASE_FILE}`);
});

// Handle shutdown
process.on('SIGTERM', () => {
    console.log('👋 Shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 Shutting down...');
    process.exit(0);
});
