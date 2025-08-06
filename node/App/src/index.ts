import { IncomingMessage, Server, ServerResponse} from "http";
import fs, { readFile } from 'fs';
import http from "http";


fs.readFile("src/index.html", (err, html) => {

    if (err) throw err

    http.createServer((req: IncomingMessage, res: ServerResponse) => {

    const stream = fs.createReadStream("./src/index.html");
    stream.on("open", () => {
        res.setHeader("Content-Type", "text/html");
        stream.pipe(res);
    })
//example
    }).listen(8080);
    
})
