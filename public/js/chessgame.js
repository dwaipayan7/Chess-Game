// public/js/chessgame.js
const socket = io();
const chess = new Chess();
const boardElement = document.querySelector('.chessboard');
let playerRole = null;

// Helper to get the Unicode symbol for a piece
const getPieceUnicode = (piece) => {
    if (!piece) return '';
    const unicodeMap = {
        w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
        b: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' },
    };
    return unicodeMap[piece.color][piece.type];
};

// Renders the board based on the current state
const renderBoard = () => {
    boardElement.innerHTML = '';
    chess.board().forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add('square');
            squareElement.classList.add((rowIndex + colIndex) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-700');
            squareElement.textContent = getPieceUnicode(square);
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = colIndex;
            squareElement.draggable = !!square && playerRole === chess.turn();
            boardElement.appendChild(squareElement);
        });
    });
};

// Handle player role assignment
socket.on('playerRole', (role) => {
    playerRole = role;
    console.log(`You are playing as: ${role}`);
});

// Handle opponent's move
socket.on('move', (move) => {
    chess.move(move);
    renderBoard();
});

// Handle board state after move
socket.on('boardState', (fen) => {
    chess.load(fen);
    renderBoard();
});

// Invalid move feedback
socket.on('invalidMove', (move) => {
    console.log(`Invalid move attempted: ${move}`);
});

renderBoard();
