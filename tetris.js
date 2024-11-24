document.getElementById('startTetris').addEventListener('click', function () {
    const tetrisCanvas = document.getElementById('tetrisCanvas');
    tetrisCanvas.style.display = 'block';

    const music = document.getElementById('tetrisMusic');
    music.play();

    const ctx = tetrisCanvas.getContext('2d');
    const row = 20;
    const col = 10;
    const box = 20;

    let board = Array.from({ length: row }, () => Array(col).fill(0));
    const tetrominoes = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[0, 1, 0], [1, 1, 1]], // T
        [[1, 1, 0], [0, 1, 1]], // S
        [[0, 1, 1], [1, 1, 0]], // Z
        [[1, 1, 1], [1, 0, 0]], // L
        [[1, 1, 1], [0, 0, 1]], // J
    ];

    let currentPiece = getRandomPiece();
    let pieceX = 3, pieceY = 0;
    let gameInterval;

    function getRandomPiece() {
        const shape = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        return { shape, row: shape.length, col: shape[0].length };
    }

    function drawCell(x, y, color = 'blue') {
        ctx.fillStyle = color;
        ctx.fillRect(x * box, y * box, box, box);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x * box, y * box, box, box);
    }

    function drawBoard() {
        ctx.clearRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                if (board[r][c]) drawCell(c, r, 'blue');
            }
        }
        drawPiece(currentPiece.shape, pieceX, pieceY);
    }

    function drawPiece(piece, x, y) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece[r].length; c++) {
  
