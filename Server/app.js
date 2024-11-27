import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors"

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,

    }
});

app.use(cors(
    {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
}

))

app.get("/", (req,res) => {
    res.send("Hello world");
});

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    

    socket.on("message", (data) => {
        console.log(data);
        
    })


    // socket.emit("welcome", "Welcome to the server");
    // socket.broadcast.emit("welcome", `Welcome to the server ${socket.id}`); //emit the msg except socket on which we reload the server
    
    socket.on("disconnect", () => {
        console.log("USer Disconnected", socket.id);
        
    })
} );



// app.listen will create new instance, io on server instance
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}` );
    
// });

// Create instance on server bcz we created io ckt on serve
server.listen(port, () => {
    console.log(`Server is running on port ${port}` );
    
});