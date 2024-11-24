document.getElementById('startPacman').addEventListener('click', function () {
    const canvas = document.getElementById('pacmanCanvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    // Game Constants
    const tileSize = 20;
    const rows = canvas.height / tileSize;
    const cols = canvas.width / tileSize;

    // Game Variables
    let pacman = { x: 1, y: 1, dx: 1, dy: 0 }; // Pac-Man starts moving right
    let ghosts = [
        { x: cols - 2, y: 1, dx: -1, dy: 0 },
        { x: cols - 2, y: rows - 2, dx: 0, dy: -1 },
    ];
    let pellets = [];
    let score = 0;
    let gameInterval;

    // Initialize Board with Pellets
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if ((r === 1 && c === 1) || (r === rows - 2 && c === cols - 2)) continue;
            pellets.push({ x: c, y: r });
        }
    }

    // Draw Game
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Pellets
        for (let pellet of pellets) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(
                pellet.x * tileSize + tileSize / 2,
                pellet.y * tileSize + tileSize / 2,
                tileSize / 5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Draw Pac-Man
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(
            pacman.x * tileSize + tileSize / 2,
            pacman.y * tileSize + tileSize / 2,
            tileSize / 2,
            0.2 * Math.PI,
            1.8 * Math.PI
        );
        ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
        ctx.fill();

        // Draw Ghosts
        for (let ghost of ghosts) {
            ctx.fillStyle = 'red';
            ctx.fillRect(
                ghost.x * tileSize + 2,
                ghost.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
        }

        // Draw Score
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Score: ' + score, 10, 20);
    }

    // Move Pac-Man
    function movePacman() {
        pacman.x += pacman.dx;
        pacman.y += pacman.dy;

        // Wrap around screen
        if (pacman.x < 0) pacman.x = cols - 1;
        if (pacman.x >= cols) pacman.x = 0;
        if (pacman.y < 0) pacman.y = rows - 1;
        if (pacman.y >= rows) pacman.y = 0;

        // Eat Pellet
        pellets = pellets.filter(p => !(p.x === pacman.x && p.y === pacman.y));
        if (pellets.some(p => p.x === pacman.x && p.y === pacman.y)) {
            score++;
        }
    }

    // Move Ghosts
    function moveGhosts() {
        for (let ghost of ghosts) {
            ghost.x += ghost.dx;
            ghost.y += ghost.dy;

            // Change direction randomly
            if (Math.random() < 0.2) {
                ghost.dx = Math.floor(Math.random() * 3) - 1;
                ghost.dy = Math.floor(Math.random() * 3) - 1;
            }

            // Wrap around screen
            if (ghost.x < 0) ghost.x = cols - 1;
            if (ghost.x >= cols) ghost.x = 0;
            if (ghost.y < 0) ghost.y = rows - 1;
            if (ghost.y >= rows) ghost.y = 0;
        }
    }

    // Check Collisions
    function checkCollisions() {
        for (let ghost of ghosts) {
            if (ghost.x === pacman.x && ghost.y === pacman.y) {
                alert('Game Over! Score: ' + score);
                clearInterval(gameInterval);
                document.location.reload();
            }
        }

        if (pellets.length === 0) {
            alert('You Win! Final Score: ' + score);
            clearInterval(gameInterval);
            document.location.reload();
        }
    }

    // Game Loop
    function gameLoop() {
        movePacman();
        moveGhosts();
        checkCollisions();
        drawGame();
    }

    // Keyboard Controls
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowUp') {
            pacman.dx = 0;
            pacman.dy = -1;
        } else if (event.key === 'ArrowDown') {
            pacman.dx = 0;
            pacman.dy = 1;
        } else if (event.key === 'ArrowLeft') {
            pacman.dx = -1;
            pacman.dy = 0;
        } else if (event.key === 'ArrowRight') {
            pacman.dx = 1;
            pacman.dy = 0;
        }
    });

    // Start Game
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200);
});
