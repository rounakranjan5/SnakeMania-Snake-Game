let inputDir = { x: 0, y: 0 };
const foodsound = new Audio("music/food.mp3");
const gameoversound = new Audio("music/gameover.mp3");
const movesound = new Audio("music/move.mp3");

let speed = 5;
let lastpainttime = 0;
let snakearr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score = 0;
let highscoreval = 0;

// Get elements from the DOM
const scorebox = document.getElementById("scorebox");
const highscorebox = document.getElementById("hiscorebox");
const board = document.getElementById("board");

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastpainttime) / 1000 < 1 / speed) {
    return;
  }

  lastpainttime = ctime;
  gameengine();
}

function isCollide(sarr) {
  // Collision with self
  for (let i = 1; i < sarr.length; i++) {
    if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) {
      return true;
    }
  }
  // Collision with wall
  if (sarr[0].x >= 18 || sarr[0].x < 0 || sarr[0].y >= 18 || sarr[0].y < 0) {
    return true;
  }
  return false;
}

function gameengine() {
  // Check for collision
  if (isCollide(snakearr)) {
    gameoversound.play();

    inputDir = { x: 0, y: 0 };
    alert("Game over !! Press any key to play the game again!");
    snakearr = [{ x: 13, y: 15 }];
    score = 0;
    scorebox.innerHTML = "Score: " + score;
    highscorebox.innerHTML = "High Score: " + highscoreval;
    
    return; // Ensure to return early after game over
  }

  // Snake eats the food
  if (snakearr[0].x === food.x && snakearr[0].y === food.y) {
    foodsound.play();
    score += 1;
    if (score > highscoreval) {
      highscoreval = score;
      localStorage.setItem("highscore", JSON.stringify(highscoreval));
      highscorebox.innerHTML = "High Score: " + highscoreval;
    }
    scorebox.innerHTML = "Score: " + score;
    snakearr.unshift({ x: snakearr[0].x + inputDir.x, y: snakearr[0].y + inputDir.y });
    let a = 2;
    let b = 16;
    food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
  }

  // Move the snake
  for (let i = snakearr.length - 2; i >= 0; i--) {
    snakearr[i + 1] = { ...snakearr[i] };
  }
  snakearr[0].x += inputDir.x;
  snakearr[0].y += inputDir.y;

  // Display the snake and food
  board.innerHTML = "";
  snakearr.forEach((e, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y + 1; // Adjusting for CSS grid index (1-based)
    snakeElement.style.gridColumnStart = e.x + 1; // Adjusting for CSS grid index (1-based)
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y + 1; // Adjusting for CSS grid index (1-based)
  foodElement.style.gridColumnStart = food.x + 1; // Adjusting for CSS grid index (1-based)
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Initialize highscore
let highscore = localStorage.getItem("highscore");
if (highscore === null) {
  highscoreval = 0;
  localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
  highscoreval = JSON.parse(highscore);
  highscorebox.innerHTML = "High Score: " + highscoreval;
}

// Start the game loop
window.requestAnimationFrame(main);

// Handle keypress for direction changes
window.addEventListener("keydown", (e) => {
 
  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y === 0) { // Prevent moving directly opposite
        inputDir = { x: 0, y: -1 };
      }
      break;

    case "ArrowDown":
      if (inputDir.y === 0) { // Prevent moving directly opposite
        inputDir = { x: 0, y: 1 };
      }
      break;

    case "ArrowLeft":
      if (inputDir.x === 0) { // Prevent moving directly opposite
        inputDir = { x: -1, y: 0 };
      }
      break;

    case "ArrowRight":
      if (inputDir.x === 0) { // Prevent moving directly opposite
        inputDir = { x: 1, y: 0 };
      }
      break;

    default:
      break;
  }
});
