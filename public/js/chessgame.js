const { Chess } = require("chess.js")

// socket.emit("Dwaipayan")
const socket = io()
const chess = new Chess()
const boardElement = document.querySelector(".chessboard")

let draggedPiece = null;
let draggedSquare = null;
let playerRole = null;

const renderBoard = ()=>{}

const handleMove = () => {}

const getPieceUnicode = () =>{}