import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import cors from "cors"




const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

const server = createServer(app);

const io = new Server(server, {
    
    cors: {
        origin: "http://localhost:5173", // Vite's default dev server URL
        methods: ["GET", "POST"],
    }
});

//connection create 

const emailToSocket = new Map();
const socketToEmail = new Map();


io.on('connection' , socket =>{

    console.log("user connection successfully  : " , socket.id);

    io.emit("hello"  ,  " hii from server ");

    socket.on("user:join" , ({email , room})=>{
        emailToSocket.set(email , socket.id);
        socketToEmail.set(socket.id , email);
        console.log("user" , email , "join room " , room);
        // io.emit("user:joined" , {email , room});

        io.to(room).emit("user:joined" , {email , id :  socket.id}); //send msg existing user
        socket.join(room)//set room
        io.to(socket.id).emit("user:join" , {email , room});



    })




    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
      });


})



app.get("/" , (req , res) =>{
    return res.send("hello world!");
})

server.listen(port , () =>{
    console.log(`server is starting on port : ${port}`);
})



