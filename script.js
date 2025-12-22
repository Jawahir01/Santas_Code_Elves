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
