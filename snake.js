let snakeInterval;

document.getElementById('startSnake').addEventListener('click', function () {
    const snakeCanvas = document.getElementById('snakeCanvas');
    snakeCanvas.style.display = 'block';

    const ctx = snakeCanvas.getContext('2d');
    const box = 20;
    let snake = [{ x: 9 * box, y: 9 * box }];
    let direction = 'RIGHT';
    let food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
    };
    let score = 0;

    function drawGame() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? 'lime' : 'green';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        const head = { ...snake[0] };

        if (direction === 'UP') head.y -= box;
        if (direction === 'DOWN') head.y += box;
        if (direction === 'LEFT') head.x -= box;
        if (direction === 'RIGHT') head.x += box;

        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= snakeCanvas.width ||
            head.y >= snakeCanvas.height ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            alert('Game Over! Your score: ' + score);
            clearInterval(snakeInterval);
            document.location.reload();
        }

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 19) * box,
                y: Math.floor(Math.random() * 19) * box,
            };
        } else {
            snake.pop();
        }

        snake.unshift(head);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 20);
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
        if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    });

    clearInterval(snakeInterval);
    snakeInterval = setInterval(drawGame, 100);
});
