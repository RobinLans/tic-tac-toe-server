const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:
            // "http://localhost:3000",
            "https://loving-goodall-298aab.netlify.app/",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User ${socket.id} has connected`);

    // io.emit("Welcome", "Hej din fitta");

    socket.on("create_room", (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} created room: ${roomName}`);
    });

    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
        socket.to(roomName).emit("joined_room", socket.id);
    });

    socket.on("send_picks", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_pick", data);
    });

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} has disconnected`);
    });
});

server.listen(process.env.PORT || 4000, () => {
    console.log("server running");
});
