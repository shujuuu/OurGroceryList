//Server-side code
//HTTP
const app = require("http").createServer(handler);
const fs = require('fs');
const url = require('url');

// app.listen(80);
// console.log("your server is running at port 80!")

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("your server is running at port 3000!");
});

//requesting handler
function handler(req, res) {
    const parsedUrl = url.parse(req.url);
    console.log("The Request is: " + parsedUrl.pathname);

    fs.readFile(__dirname + parsedUrl.pathname,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + parsedUrl.pathname);
            }
            res.writeHead(200);
            res.end(data);
        }
    );
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end('<h1>Hello World</h1>');
}

//WebSockets Communication
const io = require("socket.io").listen(app);

//Start Communication
io.sockets.on("connection", socket => {
    console.log('a new client has connected: ' + socket.id);

    //receive from a client event
    socket.on('add_item', data => {
        console.log("new item from client: " + data);
        const dataToClient = data;

        //emit from server to everyone
        // socket.emit("receive_item", dataToClient);

        //emit from server to everyone but the clients socket
        socket.broadcast.emit("receive_item", dataToClient);
    })
});