const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "images/bara.png";

const girlImg = new Image();
girlImg.src = "images/demi.png";

const kissAudio = new Audio("audio/kiss.mp3");

let player = {
  x: 50,
  y: 230,
  width: 40,
  height: 50,
  velocityY: 0,
  gravity: 1.5,
  jumpForce: -15,
  grounded: true,
};

let obstacles = [];
let score = 0;
let gameOver = false;
let gameWon = false;
let speed = 4;

function createObstacle() {
  let height = 40 + Math.random() * 20;
  obstacles.push({
    x: canvas.width,
    y: 260 - height,
    width: 20,
    height: height,
  });
}

function update() {
  if (gameOver || gameWon) return;

  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= 230) {
    player.y = 230;
    player.velocityY = 0;
    player.grounded = true;
  }

  // Move obstacles
  obstacles.forEach(obs => obs.x -= speed);
  if (Math.random() < 0.03) createObstacle();

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Check collision
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      endGame(false);
      return;
    }
  }

  // Score (1 point per jump)
  if (player.grounded && !keyPressed) {
    score++;
    document.getElementById("scoreDisplay").innerText = `${score} Days`;
    if (score >= 61) {
      gameWon = true;
      showFinalScene();
      return;
    }
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grass line
  ctx.fillStyle = "green";
  ctx.fillRect(0, 260, canvas.width, 5);

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Draw obstacles
  ctx.fillStyle = "black";
  obstacles.forEach(obs =>
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
  );

  if (gameWon) {
    ctx.drawImage(girlImg, 700, 230, 40, 50);
  }
}

let keyPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver || gameWon) location.reload();

    if (player.grounded) {
      player.velocityY = player.jumpForce;
      player.grounded = false;
      keyPressed = true;
    }
  }
});

document.addEventListener("keyup", () => {
  keyPressed = false;
});

function showFinalScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, 300, 230, 40, 50);
  ctx.drawImage(girlImg, 360, 230, 40, 50);
  kissAudio.play();
  document.getElementById("resultText").innerText = "Happy Anniversary Demilade ❤️";
  document.getElementById("endMessage").style.display = "block";
  rainHearts();
}

function endGame(win) {
  gameOver = true;
  document.getElementById("resultText").innerText = "Game Over 😢";
  document.getElementById("endMessage").style.display = "block";
}

function rainHearts() {
  const container = document.getElementById("heartsContainer");
  for (let i = 0; i < 100; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 2 + Math.random() * 3 + "s";
    container.appendChild(heart);
  }
}

function startGame() {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
    setInterval(update, 20);
  }, 3000);
}

startGame();
