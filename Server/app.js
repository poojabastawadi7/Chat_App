import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const port = 3000;
const secretKey = "AAAbbb"

const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
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

app.get("/login", (req,res) => {
   const token = jwt.sign({_id: "abcd"},secretKey );
   
   
   res
   .cookie("token", token, {httpOnly: true, secure:true, sameSite: "none" })
   .json({
        message: "Login success"
    })
});


io.use((socket, next) => { 
    cookieParser()(socket.request, socket.request.res,  (err) => {
        if(err) return next(err)

        const token = socket.request.cookies.token;

        if(!token) return next(new Error("Auth error"));

        const decodedToken = jwt.verify(token, secretKey);
        next()
    })

    
})

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    

    

    socket.on("message", ({room, message}) => {
        console.log({room, message});
        io.to(room).emit("receive-message", message)
        
    });

    socket.on("room-join", (room) =>{
        socket.join(room);
        console.log(`User joined ${room}`);
        
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