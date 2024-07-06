// public/main.js
const socket = io();

// 사용자 로그인
const username = prompt('Enter your username:');
socket.emit('login', username);

// 메시지 송신
document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('input');
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// 메시지 수신
socket.on('chat message', ({ msg, user }) => {
    const item = document.createElement('div');
    item.textContent = `${user}: ${msg}`;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// 사용자 목록 갱신
socket.on('users', (users) => {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    for (const id in users) {
        const userItem = document.createElement('div');
        userItem.textContent = users[id];
        userItem.addEventListener('click', () => {
            const msg = prompt(`Send a private message to ${users[id]}:`);
            if (msg) {
                socket.emit('private message', { to: id, msg });
            }
        });
        userList.appendChild(userItem);
    }
});

// 개인 메시지 수신
socket.on('private message', ({ msg, from }) => {
    alert(`Private message from ${from}: ${msg}`);
});
