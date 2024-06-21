const canv = document.getElementById("game-board");
const ctx = canv.getContext("2d");
const pxSize = 20;
let snake = {
    "X": canv.width/2,
    "Y": canv.height/2,
    "Length": 2,
    "Direction": null
};
let tail = [{}];
const apple = {
    "X": null,
    "Y": null,
};
let gameRunning;
let allowTurn;

// 
const startButton = document.getElementById("start");
let gameIntervalId;
// 
const restart = () => {
    startButton.style.display = "none";
    let blinkIntervalId = setInterval(() => {
        startButton.style.display = "block";
        setTimeout(() => {startButton.style.display = "none"}, 1100);
        
        startButton.addEventListener("click", function() {
            clearInterval(blinkIntervalId);
            startButton.style.display = "none";
            gameRunning = false;
            randomizeApple();
            draw();
            allowTurn = true;
        });
    }, 2000);
}
restart();

// Detect keypresses for WASD & Arrow keys
document.addEventListener("keydown", function() {
    const temp = window.event.key;
    const tempL1 = ["w", "ArrowUp", "s", "ArrowDown"];
    const tempL2 = ["a", "ArrowLeft", "d", "ArrowRight"];

    // Check for valid player movement inputs
    if ((tempL1.includes(temp) || tempL2.includes(temp)) && allowTurn) {
        // Prevent player from immediately moving in the opposite direction
        if (!(tempL1.includes(temp) && tempL1.includes(snake.Direction) || (tempL2.includes(temp) && tempL2.includes(snake.Direction)))) {
            snake.Direction = temp;
            if (["w", "ArrowUp"].includes(snake.Direction)) {console.log("Up")} else
            if (["a", "ArrowLeft"].includes(snake.Direction)) {console.log("Left")} else
            if (["s", "ArrowDown"].includes(snake.Direction)) {console.log("Down")} else
            if (["d", "ArrowRight"].includes(snake.Direction)) {console.log("Right")}
            allowTurn = false;
            
            // Start the game
            if (gameRunning == false) {
                console.log("Game start");
                gameRunning = true;
                gameIntervalId = setInterval(() => {move(), hitreg(), draw()}, 1000/30);
            }
        }
    }
});

function move() {
    // Adjust tail length
    tail.push({"X": snake.X, "Y": snake.Y})
    if (tail.length > snake.Length-1) {tail.shift()}
    
    // Move snake
    if (["w", "ArrowUp"].includes(snake.Direction)) {snake.Y -= pxSize} else
    if (["a", "ArrowLeft"].includes(snake.Direction)) {snake.X -= pxSize} else
    if (["s", "ArrowDown"].includes(snake.Direction)) {snake.Y += pxSize} else
    if (["d", "ArrowRight"].includes(snake.Direction)) {snake.X += pxSize}
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = "lime";
    ctx.fillRect(snake.X, snake.Y, pxSize, pxSize);
    ctx.fillStyle = "red";
    ctx.fillRect(apple.X, apple.Y, pxSize, pxSize);

    // Draw tail
    let opacity = 1;
    let temp = ((tail.length-1)/tail.length);
    ctx.fillStyle = "rgba(0,255,0, 1)";
    // Progressively makes tail darker and darker
    for (let i=tail.length-1; i>0; i--) {
        ctx.fillRect(tail[i].X, tail[i].Y, pxSize, pxSize);
        opacity = temp + 0.3;
        temp -= (1/tail.length);
        
        ctx.fillStyle = "rgba(0,255,0,"+opacity+")";
    }
}

function hitreg() {
    // Check for wall collisions
    if (snake.X < 0 || snake.Y < 0 || snake.X > canv.width-pxSize || snake.Y > canv.height-pxSize) {lose("a wall")} else
    // Check for apples eaten
    if (snake.X == apple.X && snake.Y == apple.Y) {
        snake.Length += 2;
        randomizeApple();
    }

    // Check for tail collisions
    for (let i=0; i<tail.length; i++) {
        if (snake.X == tail[i].X && snake.Y == tail[i].Y) {
            lose("your tail")
            break;
        }
    }
    allowTurn = true;
}

// Ensure apple's position is a multiple of 20 within canvas boundaries
function randomizeApple() {
    for (let i=0; i<tail.length; i++) {
        while ((snake.X == apple.X && snake.Y == apple.Y) || (tail[i].X == apple.X && tail[i].Y == apple.Y)) {
            apple.X = Math.floor(Math.random() * (canv.width / pxSize)) * pxSize;
            apple.Y = Math.floor(Math.random() * (canv.height / pxSize)) * pxSize;
        }
    }
    console.log("Apple: (" + apple.X + ", " + apple.Y + ")");
}

// Handle player losses and show results
function lose(reason) {
    clearInterval(gameIntervalId);
    gameRunning = null;
    alert("You hit " + reason + "!\n\nScore: " + snake.Length);
    reset();
    restart();
}

function reset() {
    snake = {
        "X": canv.width/2,
        "Y": canv.height/2,
        "Length": 2,
        "Direction": null
    };
    tail = [{}];
}