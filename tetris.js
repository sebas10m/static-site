document.getElementById('startTetris').addEventListener('click', function () {
    const tetrisCanvas = document.getElementById('tetrisCanvas');
    tetrisCanvas.style.display = 'block';

    const ctx = tetrisCanvas.getContext('2d');
    const row = 20;
    const col = 10;
    const box = 20;

    // Create the board
    let board = Array.from({ length: row }, () => Array(col).fill(0));

    // Tetromino shapes
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
    let pieceX = 3, pieceY = 0; // Initial position
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
                if (piece[r][c]) drawCell(x + c, y + r);
            }
        }
    }

    function collision(newX, newY, newPiece) {
        for (let r = 0; r < newPiece.length; r++) {
            for (let c = 0; c < newPiece[r].length; c++) {
                if (!newPiece[r][c]) continue;
                const newBoardY = newY + r;
                const newBoardX = newX + c;

                if (
                    newBoardY >= row || // Bottom wall
                    newBoardX < 0 || // Left wall
                    newBoardX >= col || // Right wall
                    board[newBoardY][newBoardX] // Collision with another block
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function freezePiece() {
        currentPiece.shape.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) board[pieceY + r][pieceX + c] = 1;
            });
        });
        currentPiece = getRandomPiece();
        pieceX = 3;
        pieceY = 0;

        if (collision(pieceX, pieceY, currentPiece.shape)) {
            clearInterval(gameInterval);
            alert('Game Over!');
        }
    }

    function rotatePiece() {
        const rotated = currentPiece.shape[0].map((_, c) =>
            currentPiece.shape.map(row => row[c]).reverse()
        );
        if (!collision(pieceX, pieceY, rotated)) {
            currentPiece.shape = rotated;
        }
    }

    function clearLines() {
        board = board.filter(row => row.some(cell => !cell));
        while (board.length < row) {
            board.unshift(Array(col).fill(0));
        }
    }

    function moveDown() {
        if (!collision(pieceX, pieceY + 1, currentPiece.shape)) {
            pieceY++;
        } else {
            freezePiece();
            clearLines();
        }
    }

    function control(event) {
        if (event.key === 'ArrowLeft' && !collision(pieceX - 1, pieceY, currentPiece.shape)) {
            pieceX--;
        } else if (event.key === 'ArrowRight' && !collision(pieceX + 1, pieceY, currentPiece.shape)) {
            pieceX++;
        } else if (event.key === 'ArrowDown') {
            moveDown();
        } else if (event.key === 'ArrowUp') {
            rotatePiece();
        }
    }

    document.addEventListener('keydown', control);

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveDown();
        drawBoard();
    }, 500);
});
