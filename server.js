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
    // console.log("The Request is: " + parsedUrl.pathname);

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

    //demo1 -> listen to client event
    console.log("new client connected...");

    //demo2 -> listen to client event + receive msg
    socket.on("someone_joined", data => {
        console.log(data);

        //demo3 -> send to client
        socket.emit("server_response", "Wave back from server");
    })


    //demo4 -> Shopping list, listen to client event + receive data
    socket.on('add_item', data => {
        const dataToClient = data;

        //demo5 -> Shopping list, send data to client
        io.sockets.emit("receive_item", dataToClient);

        //send data to everyone except the sender
        //socket.broadcast.emit("receive_item", dataToClient);
    })

});