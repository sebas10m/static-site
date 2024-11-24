document.getElementById('startArkanoid').addEventListener('click', function () {
    const canvas = document.getElementById('arkanoidCanvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const music = document.getElementById('arkanoidMusic');
    music.play();
    // Game Variables
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballDX = 2;
    let ballDY = -2;
    const ballRadius = 10;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    const paddleDX = 7;

    const brickRowCount = 5;
    const brickColumnCount = 7;
    const brickWidth = 50;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let score = 0;
    let lives = 3;

    // Create Bricks
    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }; // Status 1 means brick is visible
        }
    }

    // Draw Ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    // Draw Paddle
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    // Draw Bricks
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = 'green';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // Draw Score
    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Score: ' + score, 8, 20);
    }

    // Draw Lives
    function drawLives() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
    }

    // Collision Detection
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (
                        ballX > b.x &&
                        ballX < b.x + brickWidth &&
                        ballY > b.y &&
                        ballY < b.y + brickHeight
                    ) {
                        ballDY = -ballDY;
                        b.status = 0; // Brick is destroyed
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            alert('YOU WIN!');
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    // Draw Everything
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        // Ball Movement
        ballX += ballDX;
        ballY += ballDY;

        // Ball Collision with Walls
        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
            } else {
                lives--;
                if (!lives) {
                    alert('GAME OVER');
					snakeMusic.pause(); // Stop the music
					snakeMusic.currentTime = 0; // Reset music playback
                    document.location.reload();
                } else {
                    ballX = canvas.width / 2;
                    ballY = canvas.height - 30;
                    ballDX = 2;
                    ballDY = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        // Paddle Movement
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += paddleDX;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= paddleDX;
        }

        requestAnimationFrame(draw);
    }

    // Key Handlers
    let rightPressed = false;
    let leftPressed = false;
    document.addEventListener('keydown', event => {
        if (event.key === 'Right' || event.key === 'ArrowRight') {
            rightPressed = true;
        } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
            leftPressed = true;
        }
    });
    document.addEventListener('keyup', event => {
        if (event.key === 'Right' || event.key === 'ArrowRight') {
            rightPressed = false;
        } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
            leftPressed = false;
        }
    });

    draw();
});
