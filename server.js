//Server-side code
//Create an HTTP server
const app = require("http").createServer(handler);
const fs = require('fs');
const url = require('url');
const port = process.env.PORT || 3000
const INDEX = '/index.html';
app.listen(port, () => {
    console.log("Server runs successfully! Check your shopping list at: http://localhost:3000");
});

//requesting handler
function handler(req, res) {
    const parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);

    if (parsedUrl.pathname === '/') {
        const htmlPath = __dirname + parsedUrl.pathname + 'index.html'
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + htmlPath);
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}

//Create the WebSockets Communication
const io = require("socket.io").listen(app);
let totalClients = 0;
//Start Communication
io.sockets.on("connection", socket => {
    totalClients++;
    console.log('a new client has connected: ' + socket.id);
    console.log('total clients: ' + totalClients);

    //receive from a client event
    socket.on('add_item', data => {
        console.log("new item from client: " + data);
        const dataToClient = data;

        //emit from server to everyone
        io.sockets.emit("receive_item", dataToClient);

        //emit from server to everyone but the sender
        // socket.broadcast.emit("receive_item", dataToClient);
    })

    //when a client disconnects
    socket.on('disconnect', () => {
        totalClients--;
        console.log('total users: ' + totalClients);
        console.log('a client disconnects: ' + socket.id);
    })
});