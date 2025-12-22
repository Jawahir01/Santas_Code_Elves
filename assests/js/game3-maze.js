const CELL_SIZE = 30;
const MAZE_SIZE = 15;
let player = { x: 0, y: 0 };
let timer;
let timeLeft = 60; // seconds to play
let maze;
let exitPos;
let gameActive = false;

function generateMaze() { //Maze generation logic
    maze = Array(MAZE_SIZE)
    .fill()
    .map(()=> 
        Array(MAZE_SIZE)
            .fill()
            .map(() => ({
                walls: {top: true, right: true, bottom: true, left: true},
                visited: false,
            }))
        );

        let stack = [];
        let current = {x: 0, y: 0};
        maze[0][0].visited = true;

        while (true) {
            let neighbors = []
            if (current.x > 0 && !maze[current.y][current.x - 1].visited)
                neighbors.push("left");
            if (current.x < MAZE_SIZE - 1 && !maze[current.y][current.x + 1].visited)
                neighbors.push("right");
            if (current.y > 0 && !maze[current.y - 1][current.x].visited)
                neighbors.push("top");
            if (current.y < MAZE_SIZE - 1 && !maze[current.y + 1][current.x].visited)
                neighbors.push("bottom");

            if (neighbors.length > 0) {
                let direction = neighbors[Math.floor(Math.random() * neighbors.length)];
                let next = {x: current.x, y: current.y};

                switch (direction) {
                    case "left":
                        maze[current.y][current.x].walls.left = false;
                        maze[current.y][current.x - 1].walls.right = false;
                        next.x--;
                        break;
                    case "right":
                        maze[current.y][current.x].walls.right = false;
                        maze[current.y][current.x + 1].walls.left = false;
                        next.x++;
                        break;
                    case "top":
                        maze[current.y][current.x].walls.top = false;
                        maze[current.y - 1][current.x].walls.bottom = false;
                        next.y--;
                        break;
                    case "bottom":
                        maze[current.y][current.x].walls.bottom = false;
                        maze[current.y + 1][current.x].walls.top = false;
                        next.y++;
                        break;
                }
            
            maze[next.y][next.x].visited = true;
            stack.push(current);
            current = next;
        } else if (stack.length > 0) { 
            current = stack.pop();
        } else {
            break;
        }
    }
let slide, exitX, exitY;
do {
    side = Math.floor(Math.random() * 4); //Generate a random exit position on maze border
    switch (side) {
        case 0: 
            exitY = Math.floor(Math.random() * MAZE_SIZE);
            exitX = 0;
            break;
        case 1: 
            exitX = MAZE_SIZE - 1;
            exitY = Math.floor(Math.random() * MAZE_SIZE);  /*check out later*/
            break;
        case 2: 
            exitY = MAZE_SIZE - 1;
            exitX = Math.floor(Math.random() * MAZE_SIZE);  /*check out later*/
            break;
        case 3: 
            exitX = 0;
            exitY = Math.floor(Math.random() * MAZE_SIZE);  /*check out later*/
            break;
    }
} while (exitX === 0 && exitY === 0);
exitPos = {x: exitX, y: exitY};

switch (side) {
    case 0 :
        maze[exitY][exitX].walls.top = false;
        break;
    case 1 :
        maze[exitY][exitX].walls.right = false;
        break;
    case 2 :
        maze[exitY][exitX].walls.bottom = false;
        break;
    case 3 :
        maze[exitY][exitX].walls.left = false;
        break;
    }
}

function renderMaze() { //Rendering the maze
    const mazeElement = document.getElementById("maze"); // Changed from maze-container
    mazeElement.style.gridTemplateColumns = `repeat(${MAZE_SIZE}, ${CELL_SIZE}px)`;
    mazeElement.style.gridTemplateRows = `repeat(${MAZE_SIZE}, ${CELL_SIZE}px)`;
    mazeElement.style.width = MAZE_SIZE * CELL_SIZE + "px";
    mazeElement.style.height = MAZE_SIZE * CELL_SIZE + "px";
    mazeElement.innerHTML = ""; // Clear only the maze, not the player

    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cell = document.createElement("div");
            cell.className = "cell" + (x === exitPos.x && y === exitPos.y ? " exit" : "");
            cell.style.width = CELL_SIZE + "px";
            cell.style.height = CELL_SIZE + "px";

            Object.entries(maze[y][x].walls).forEach(([dir, exists]) => {
                if (exists) {
                    const wall = document.createElement("div");
                    wall.className = `wall ${dir}`;
                    cell.appendChild(wall);
                }
            });

            mazeElement.appendChild(cell); // Append to maze element
        }
    }
    updatePlayerPosition();
}

function updatePlayerPosition() {
    const playerElem = document.getElementById('player');
    const mazeElement = document.getElementById('maze');
    
    // Get maze position relative to container
    const mazeRect = mazeElement.getBoundingClientRect();
    const containerRect = mazeElement.parentElement.getBoundingClientRect();
    const mazeOffsetLeft = mazeRect.left - containerRect.left;
    const mazeOffsetTop = mazeRect.top - containerRect.top;
    
    playerElem.style.width = CELL_SIZE * 0.6 + "px";
    playerElem.style.height = CELL_SIZE * 0.6 + "px";
    
    // Add maze offset to position
    playerElem.style.left = (mazeOffsetLeft + player.x * CELL_SIZE + CELL_SIZE * 0.2) + "px";
    playerElem.style.top = (mazeOffsetTop + player.y * CELL_SIZE + CELL_SIZE * 0.2) + "px";
    
    if (player.x === exitPos.x && player.y === exitPos.y) {
        showMessage("Congratulations! You've helped Santa!");
    }
}
function movePlayer(direction) { //Player movement logic
    if (!gameActive) return;
    const walls = maze[player.y][player.x].walls;
    switch (direction) {
        case "up": 
        if (!walls.top) player.y--;
        break;
        case "down": 
        if (!walls.bottom) player.y++;
        break;
        case "left": 
        if (!walls.left) player.x--;
        break;
        case "right": 
        if (!walls.right) player.x++;
        break;
    }
    updatePlayerPosition();
}

function showMessage(text) {
    gameActive = false;
    clearInterval(timer);
    document.getElementById("message-text").textContent = text;
    document.getElementById("message").style.display = "block";
}

function initMazeGame() { //Game initialization
gameActive = true;
timeLeft = 60;
document.getElementById("timer").textContent = `Timer: ${timeLeft}s`;
document.getElementById("message").style.display = "none"; //Hide message section
player = {x: 0, y: 0}; //reset player position to start
generateMaze();
renderMaze();


timer = setInterval(() => { //timer of 60s
    timeLeft--;
    document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
        showMessage("Time's up! You couldn't make it.");
    }
}, 1000);
}

document.addEventListener("keydown", (e) => { //Keyboard controls
    const directions = {

        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    };

    if (directions[e.key] && gameActive) {
        movePlayer(directions[e.key]);
        const buttonId = directions[e.key];
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add("hover-effect");
        }
}
});

document.addEventListener("keyUp", (e) => { //Remove hover effect on key release
    const directions = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    };
    if (directions[e.key]) {
        const buttonId = directions[e.key];
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.remove("hover-effect");
    }
}
})

initMazeGame();//Start the game on load