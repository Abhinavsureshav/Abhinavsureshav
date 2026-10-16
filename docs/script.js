const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const startBtn = document.getElementById("startBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let direction;
let nextDirection;
let food;
let score;
let bestScore;
let gameInterval;

function getSavedBest() {
  return Number(localStorage.getItem("snake-best") || 0);
}

function setSavedBest(value) {
  localStorage.setItem("snake-best", String(value));
}

function initGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = "0";
  bestScore = getSavedBest();
  bestEl.textContent = String(bestScore);
  spawnFood();
  draw();
}

function spawnFood() {
  let valid = false;

  while (!valid) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };

    valid = !snake.some((segment) => segment.x === food.x && segment.y === food.y);
  }
}

function startGame() {
  clearInterval(gameInterval);
  initGame();
  gameInterval = setInterval(update, 120);
}

function endGame() {
  clearInterval(gameInterval);
  bestScore = Math.max(bestScore, score);
  bestEl.textContent = String(bestScore);
  setSavedBest(bestScore);
  drawGameOver();
}

function update() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  const hitWall =
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount;

  const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = String(score);
    bestScore = Math.max(bestScore, score);
    bestEl.textContent = String(bestScore);
    setSavedBest(bestScore);
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function drawGameOver() {
  ctx.fillStyle = "rgba(7, 10, 18, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";
  ctx.font = "bold 30px Segoe UI";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "18px Segoe UI";
  ctx.fillText("Press Start / Restart", canvas.width / 2, canvas.height / 2 + 30);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }

  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(food.x * gridSize + 4, food.y * gridSize + 4, gridSize - 8, gridSize - 8);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#86efac" : "#34d399";
    ctx.fillRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );

    if (index === 0) {
      ctx.fillStyle = "#052e16";
      ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 6, 4, 4);
      ctx.fillRect(segment.x * gridSize + gridSize - 10, segment.y * gridSize + 6, 4, 4);
    }
  });
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") {
    if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
  } else if (key === "arrowdown" || key === "s") {
    if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
  } else if (key === "arrowleft" || key === "a") {
    if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
  } else if (key === "arrowright" || key === "d") {
    if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
  }
});

startBtn.addEventListener("click", startGame);

bestScore = getSavedBest();
bestEl.textContent = String(bestScore);
initGame();
