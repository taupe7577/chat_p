// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

let users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 사용자 로그인
    socket.on('login', (username) => {
        users[socket.id] = username;  // 사용자 이름 저장
        socket.broadcast.emit('user connected', username);
        io.emit('users', users);
    });

    // 메시지 송신
    socket.on('chat message', (msg) => {
        if (users[socket.id]) {
            io.emit('chat message', { msg, user: users[socket.id] });
        }
    });

    // 개인 메시지 송신
    socket.on('private message', ({ to, msg }) => {
        if (users[socket.id] && users[to]) {
            socket.to(to).emit('private message', { msg, from: users[socket.id] });
        }
    });

    // 사용자 로그아웃
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (users[socket.id]) {
            io.emit('user disconnected', users[socket.id]);
            delete users[socket.id];
            io.emit('users', users);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
