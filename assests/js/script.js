// Game State - MAIN GAME
const gameState = {
    currentHouse: 0,
    completedHouses: 0,
    totalHouses: 4,
    isPlaying: false,
    santaPosition: 0
};

// DOM Elements
let startBtn, endBtn, howToPlayBtn, elvesBtn, santa, housesContainer, houses;
let progressText, progressFill, completionMessage, snowContainer;
let mainGame, game1Container, game2Container, game3Container, game4Container;

// Initialize the game
function initGame() {
    // Get DOM elements
    startBtn = document.getElementById('startBtn');
    endBtn = document.getElementById('endBtn');
    howToPlayBtn = document.getElementById('howToPlayBtn');
    elvesBtn = document.getElementById('elvesBtn');
    santa = document.getElementById('santa');
    housesContainer = document.getElementById('houses-container');
    houses = document.querySelectorAll('.house');
    progressText = document.getElementById('progress-text');
    progressFill = document.getElementById('progress-fill');
    completionMessage = document.getElementById('completion-message');
    snowContainer = document.getElementById('snow');
    
    // Get screen elements
    mainGame = document.getElementById('mainGame');
    game1Container = document.getElementById('game1Container');
    game2Container = document.getElementById('game2Container');
    game3Container = document.getElementById('game3Container');
    game4Container = document.getElementById('game4Container');
    
    resetGame();
    createSnowflakes();
    setupEventListeners();
}

// Reset game to initial state
function resetGame() {
    gameState.currentHouse = 0;
    gameState.completedHouses = 0;
    gameState.isPlaying = false;
    gameState.santaPosition = 0;
    
    // Reset Santa position
    santa.style.left = '0px';
    
    // Reset all houses to locked state
    houses.forEach(house => {
        const status = house.querySelector('.house-status');
        status.textContent = '🔒';
        house.classList.remove('unlocked', 'completed');
        house.classList.add('locked');
    });
    
    // Reset progress
    updateProgress();
    
    // Hide completion message
    completionMessage.style.display = 'none';
    
    // Reset buttons
    startBtn.disabled = false;
    endBtn.disabled = true;
}

// Create snowflake animation
function createSnowflakes() {
    // Clear any existing snowflakes
    snowContainer.innerHTML = '';
    
    // Create 50 snowflakes
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        
        // Random properties
        const size = Math.random() * 20 + 10;
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 5 + 5;
        const opacity = Math.random() * 0.7 + 0.3;
        const delay = Math.random() * 5;
        
        // Apply styles
        snowflake.style.left = `${startPosition}%`;
        snowflake.style.top = '-20px';
        snowflake.style.fontSize = `${size}px`;
        snowflake.style.opacity = opacity;
        
        // Animation
        snowflake.style.animation = `fall ${animationDuration}s linear ${delay}s infinite`;
        
        snowContainer.appendChild(snowflake);
    }
    
    // Add CSS for falling animation
    if (!document.querySelector('#snow-animation')) {
        const style = document.createElement('style');
        style.id = 'snow-animation';
        style.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Set up event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    endBtn.addEventListener('click', endGame);
    elvesBtn.addEventListener('click', showElvesInfo);
    howToPlayBtn.addEventListener('click', showHowToPlay);

    
    // Add click events to houses
    houses.forEach((house, index) => {
        house.addEventListener('click', () => {
            const houseNumber = parseInt(house.dataset.house);
            
            if (!gameState.isPlaying) {
                showSantaMessage("Click 'Start Game' first!");
                return;
            }
            
            if (houseNumber === gameState.currentHouse + 1 && 
                !house.classList.contains('completed')) {
                openMiniGame(houseNumber);
            } else if (houseNumber > gameState.currentHouse + 1) {
                showSantaMessage("Complete the previous game first!");
            }
        });
    });
}

// Start the game
function startGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    startBtn.disabled = true;
    endBtn.disabled = false;
    
    // Move Santa to first house
    moveSantaToHouse(1);
    
    // Play start sound
    playSound('start');
}

// End the game
function endGame() {
    if (!gameState.isPlaying) return;
    
    gameState.isPlaying = false;
    startBtn.disabled = false;
    endBtn.disabled = true;
    
    // Show completion message if all houses are completed
    if (gameState.completedHouses === gameState.totalHouses) {
        completionMessage.style.display = 'block';
    }
}

// Move Santa to a specific house
function moveSantaToHouse(houseNumber) {
    if (houseNumber < 1 || houseNumber > gameState.totalHouses) return;
    
    const houseElements = document.querySelectorAll('.house');
    const targetHouse = houseElements[houseNumber - 1];
    const houseRect = targetHouse.getBoundingClientRect();
    const containerRect = housesContainer.getBoundingClientRect();
    
    const santaLeft = houseRect.left - containerRect.left + (houseRect.width / 2) - 50;
    
    gameState.currentHouse = houseNumber - 1;
    gameState.santaPosition = santaLeft;
    
    // Add walking animation
    santa.style.animation = 'santaWalk 0.5s infinite';
    santa.style.left = `${santaLeft}px`;
    
    setTimeout(() => {
        santa.style.animation = 'santaBounce 1s infinite alternate';
    }, 2000);
    
    // Unlock the current house
    unlockHouse(houseNumber - 1);
}

// Unlock a house
function unlockHouse(houseIndex) {
    if (houseIndex >= houses.length) return;
    
    const house = houses[houseIndex];
    const status = house.querySelector('.house-status');
    
    house.classList.remove('locked');
    house.classList.add('unlocked');
    status.textContent = '🎮';
}

// Complete the current house
function completeCurrentHouse() {
    if (!gameState.isPlaying) return;
    
    const currentHouseIndex = gameState.currentHouse;
    const house = houses[currentHouseIndex];
    const status = house.querySelector('.house-status');
    
    house.classList.remove('unlocked');
    house.classList.add('completed');
    status.textContent = '✅';
    
    gameState.completedHouses++;
    
    // Play Santa's "Ho Ho Ho" sound
    playSound('hohoho');
    
    // Update progress
    updateProgress();
    
    // Move to next house if available
    if (gameState.currentHouse < gameState.totalHouses - 1) {
        setTimeout(() => {
            moveSantaToHouse(gameState.currentHouse + 2);
        }, 1000);
    } else {
        // All houses completed
        setTimeout(() => {
            endGame();
        }, 1500);
    }
}

// Update progress display
function updateProgress() {
    const progressPercent = (gameState.completedHouses / gameState.totalHouses) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${gameState.completedHouses}/${gameState.totalHouses} Games Completed`;
}

// Play sounds
function playSound(type) {
    switch(type) {
        case 'start':
            showSantaMessage("Let's help Santa!");
            break;
        case 'hohoho':
            showSantaMessage("Ho Ho Ho!");
            break;
        case 'end':
            showSantaMessage("Thank you for helping Santa!");
            break;
    }
}

// Show Santa message
function showSantaMessage(message) {
    const existingMessage = santa.querySelector('.santa-message');
    if (existingMessage) existingMessage.remove();
    
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.classList.add('santa-message');
    messageEl.style.position = 'absolute';
    messageEl.style.top = '-50px';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translateX(-50%)';
    messageEl.style.background = 'rgba(255, 255, 255, 0.9)';
    messageEl.style.color = '#d32f2f';
    messageEl.style.padding = '8px 15px';
    messageEl.style.borderRadius = '20px';
    messageEl.style.fontWeight = 'bold';
    messageEl.style.fontSize = '1.2rem';
    messageEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    messageEl.style.zIndex = '100';
    messageEl.style.whiteSpace = 'nowrap';
    
    santa.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.remove();
    }, 2000);
}


// Show Elves information
function showElvesInfo() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('elvesModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'elvesModal';
        modal.classList.add('elves-modal');
        modal.innerHTML = `
            <div class="elves-modal-content">
                <button class="close-modal">&times;</button>
                <h2><i class="fas fa-hat-wizard"></i> The Code Elves</h2>
                <p>Meet the team of magical elves who help Santa with coding challenges!</p>
                <p>These skilled programmers work behind the scenes to make sure Santa's delivery system runs smoothly.</p>
                <div class="elves-list">
                    <div class="elf">
                        <i class="fas fa-code"></i>
                        <p>Algo Elf</p>
                    </div>
                    <div class="elf">
                        <i class="fas fa-paint-brush"></i>
                        <p>CSS Elf</p>
                    </div>
                    <div class="elf">
                        <i class="fas fa-cogs"></i>
                        <p>Logic Elf</p>
                    </div>
                    <div class="elf">
                        <i class="fas fa-bug"></i>
                        <p>Debug Elf</p>
                    </div>
                </div>
                <p>Together, they ensure that every line of code is festive and bug-free for Christmas delivery!</p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listener to close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
}


// Show How to Play instructions
function showHowToPlay() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('howToPlayModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'howToPlayModal';
        modal.classList.add('how-to-play-modal');
        modal.innerHTML = `
            <div class="how-to-play-modal-content">
                <button class="close-modal">&times;</button>
                <h2><i class="fas fa-question-circle"></i> How to Play</h2>
                <p>Help Santa deliver presents to all the houses by completing each coding challenge!</p>
                <ul>
                    <li>Click "Start Game" to begin the adventure</li>
                    <li>Santa will visit the first house and unlock the first game</li>
                    <li>Complete each game to unlock the next house</li>
                    <li>When you finish a game, Santa will say "Ho Ho Ho!" and move to the next house</li>
                    <li>Complete all four games to help Santa finish his deliveries</li>
                </ul>
                <p>Good luck, and thank you for helping Santa!</p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listener to close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
}

// Open mini-game based on house number
function openMiniGame(houseNumber) {
    // Hide main game
    mainGame.style.display = 'none';
    
    // Show the appropriate mini-game
    switch(houseNumber) {
        case 1:
            initGrinchHuntGame();
            game1Container.style.display = 'flex';
            break;
        case 2:
            initMazeGame();
            game2Container.style.display = 'flex';
            break;
        case 3:
            initCodePuzzleGame();
            game3Container.style.display = 'flex';
            break;
        case 4:
            initPresentStackGame();
            game4Container.style.display = 'flex';
            break;
    }
}

// Return to main game from any mini-game
function returnToMainGame(gameWon = false) {
    // Hide all game containers
    game1Container.style.display = 'none';
    game2Container.style.display = 'none';
    game3Container.style.display = 'none';
    game4Container.style.display = 'none';
    
    // Show main game
    mainGame.style.display = 'block';
    
    // If game was won, complete the current house
    if (gameWon) {
        completeCurrentHouse();
    }
}

// Close a mini-game without winning
function closeMiniGame() {
    returnToMainGame(false);
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Game 2: Maze Game Logic
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