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
    side = Math.floor(Math.random() * 4);
    switch (side) {
        case 0: 
            exitX = (Math.floor(Math.random() * MAZE_SIZE));
            exitY = 0;
            break;
        case 1: 
            exitX = MAZE_SIZE - 1;
            exitY = (Math.floor(Math.random * MAZE_SIZE));  /*check out later*/
            break;
    }
}
}