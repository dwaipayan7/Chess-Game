// server.js
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const chess = new Chess();
let players = {};

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Chess Game' });
});

io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    if (!players.white) {
        players.white = socket.id;
        socket.emit('playerRole', 'w');
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit('playerRole', 'b');
    } else {
        socket.emit('spectatorRole');
    }

    socket.on('disconnect', () => {
        if (socket.id === players.white) {
            delete players.white;
        } else if (socket.id === players.black) {
            delete players.black;
        } else {
            console.log('Spectator disconnected');
        }
        io.emit('updatePlayers', players);
    });

    socket.on('move', (move) => {
        try {
            if ((chess.turn() === 'w' && socket.id !== players.white) ||
                (chess.turn() === 'b' && socket.id !== players.black)) {
                return;
            }

            const result = chess.move(move);
            if (result) {
                io.emit('move', move);
                io.emit('boardState', chess.fen());
            } else {
                console.log('Invalid move');
                socket.emit('invalidMove', move);
            }
        } catch (error) {
            console.error(error);
        }
    });
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
