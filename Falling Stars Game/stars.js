function initializeStarGame() {
    // Game state variables
    let gameState = {
        isPlaying: false,
        score: 0,
        timeLeft: 45,
        playerName: '',
        basket: { x: 275, y: 550, width: 80, height: 20 },
        stars: [],
        keys: {},
        starSpeed: 2,
        spawnRate: 0.02,
        gameLoop: null,
        timerInterval: null
    };

    // DOM elements with error checking
    const elements = {
        startScreen: document.getElementById('startScreen'),
        gameHud: document.getElementById('gameHud'),
        gameTimer: document.getElementById('gameTimer'),
        gameCanvas: document.getElementById('gameCanvas'),
        gameOverScreen: document.getElementById('gameOverScreen'),
        playerName: document.getElementById('playerName'),
        startBtn: document.getElementById('startBtn'),
        currentScore: document.getElementById('currentScore'),
        highScore: document.getElementById('highScore'),
        finalScore: document.getElementById('finalScore'),
        playerGreeting: document.getElementById('playerGreeting'),
        playAgainBtn: document.getElementById('playAgainBtn')
    };

    // Check if all elements exist
    const missingElements = Object.keys(elements).filter(key => !elements[key]);
    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
        return;
    }

    const canvas = elements.gameCanvas;
    const ctx = canvas.getContext('2d');

    // Initialize canvas size
    function initCanvas() {
        canvas.width = 600;
        canvas.height = 600;
    }

    // Load high score from memory (session-based)
    function loadHighScore() {
        try {
            const saved = sessionStorage.getItem('starCatcherHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            return 0;
        }
    }

    // Save high score to memory
    function saveHighScore(score) {
        try {
            sessionStorage.setItem('starCatcherHighScore', score.toString());
        } catch (e) {
            console.warn('Could not save high score');
        }
    }

    // Update high score display
    function updateHighScore() {
        const highScore = loadHighScore();
        elements.highScore.textContent = highScore;
        
        if (gameState.score > highScore) {
            saveHighScore(gameState.score);
            elements.highScore.textContent = gameState.score;
        }
    }

    // Add this function to clear all key states
    function clearKeyStates() {
        gameState.keys = {};
    }

    // Create a new star object
    function createStar() {
        return {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            size: 15,
            speed: gameState.starSpeed + Math.random() * 2,
            rotation: 0
        };
    }

    // Draw a five-pointed star
    function drawStar(x, y, size, rotation) {
        ctx.save();
        ctx.translate(x + size, y + size);
        ctx.rotate(rotation);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 144 - 90) * Math.PI / 180;
            const x1 = Math.cos(angle) * size;
            const y1 = Math.sin(angle) * size;
            
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
            
            const innerAngle = ((i * 144) + 72 - 90) * Math.PI / 180;
            const x2 = Math.cos(innerAngle) * (size * 0.4);
            const y2 = Math.sin(innerAngle) * (size * 0.4);
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    // Draw the basket
    function drawBasket() {
        const { x, y, width, height } = gameState.basket;
        
        // Basket body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, width, height);
        
        // Basket rim
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(x - 5, y - 5, width + 10, 8);
        
        // Basket pattern
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const lineX = x + (width / 4) * (i + 1);
            ctx.beginPath();
            ctx.moveTo(lineX, y);
            ctx.lineTo(lineX, y + height);
            ctx.stroke();
        }
    }

    // Check collision between star and basket
    function checkCollision(star) {
        const { x, y, width, height } = gameState.basket;
        return (
            star.x + star.size * 2 > x &&
            star.x < x + width &&
            star.y + star.size * 2 > y &&
            star.y < y + height
        );
    }

    // Update game logic
    function updateGame() {
        // Move basket based on key input (Arrow keys or A/D keys)
        if ((gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) && gameState.basket.x > 0) {
            gameState.basket.x -= 8;
        }
        if ((gameState.keys['ArrowRight'] || gameState.keys['KeyD']) && gameState.basket.x < canvas.width - gameState.basket.width) {
            gameState.basket.x += 8;
        }

        // Spawn new stars
        if (Math.random() < gameState.spawnRate) {
            gameState.stars.push(createStar());
        }

        // Update stars
        for (let i = gameState.stars.length - 1; i >= 0; i--) {
            const star = gameState.stars[i];
            star.y += star.speed;
            star.rotation += 0.1;

            // Check collision with basket
            if (checkCollision(star)) {
                gameState.score++;
                elements.currentScore.textContent = gameState.score;
                gameState.stars.splice(i, 1);
                updateHighScore();
            }
            // Remove stars that fell off screen
            else if (star.y > canvas.height) {
                gameState.stars.splice(i, 1);
            }
        }

        // Increase difficulty every 15 seconds
        const elapsedTime = 45 - gameState.timeLeft;
        if (elapsedTime > 0 && elapsedTime % 15 === 0) {
            gameState.starSpeed = Math.min(gameState.starSpeed + 0.5, 8);
            gameState.spawnRate = Math.min(gameState.spawnRate + 0.005, 0.06);
        }
    }

    // Render game graphics
    function renderGame() {
        // Clear canvas with subtle gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(30, 60, 114, 0.3)');
        gradient.addColorStop(1, 'rgba(42, 82, 152, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        gameState.stars.forEach(star => {
            drawStar(star.x, star.y, star.size, star.rotation);
        });

        // Draw basket
        drawBasket();
    }

    // Main game loop
    function gameLoop() {
        if (!gameState.isPlaying) return;
        
        updateGame();
        renderGame();
        gameState.gameLoop = requestAnimationFrame(gameLoop);
    }

    // Start the game
    function startGame() {
        console.log('Starting game...'); // Debug log
        gameState.playerName = elements.playerName.value.trim() || 'Player';
        gameState.isPlaying = true;
        gameState.score = 0;
        gameState.timeLeft = 45;
        gameState.stars = [];
        gameState.starSpeed = 2;
        gameState.spawnRate = 0.02;
        gameState.basket.x = 275;
        
        // Clear keyboard states at game start
        clearKeyStates();

        // Hide start screen, show game elements
        elements.startScreen.style.display = 'none';
        elements.gameHud.style.display = 'flex';
        elements.gameTimer.style.display = 'block';
        elements.gameCanvas.style.display = 'block';

        // Update displays
        elements.currentScore.textContent = '0';
        elements.gameTimer.textContent = '45';
        updateHighScore();

        // Start game timer
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            elements.gameTimer.textContent = gameState.timeLeft;
            
            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        // Start game loop
        gameLoop();
    }

    // End the game
    function endGame() {
        gameState.isPlaying = false;
        clearInterval(gameState.timerInterval);
        cancelAnimationFrame(gameState.gameLoop);
        
        // Clear keyboard states to prevent stuck keys
        clearKeyStates();

        // Update final score and show game over screen
        elements.finalScore.textContent = `Final Score: ${gameState.score}`;
        elements.playerGreeting.textContent = `Great job, ${gameState.playerName}!`;
        elements.gameOverScreen.style.display = 'flex';
    }

    // Reset game for replay
    function resetGame() {
        // Clear keyboard states when resetting
        clearKeyStates();
        
        elements.gameOverScreen.style.display = 'none';
        elements.gameHud.style.display = 'none';
        elements.gameTimer.style.display = 'none';
        elements.gameCanvas.style.display = 'none';
        elements.startScreen.style.display = 'flex';
        elements.playerName.focus();
    }

    // Event listeners
    elements.startBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Start button clicked'); // Debug log
        startGame();
    });

    elements.playAgainBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resetGame();
    });

    // Handle Enter key in name input
    elements.playerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            startGame();
        }
    });

    // Keyboard controls - only work during gameplay
    document.addEventListener('keydown', (e) => {
        if (gameState.isPlaying) {
            gameState.keys[e.code] = true;
            
            // Prevent arrow keys and A/D keys from scrolling the page during gameplay
            if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
                e.preventDefault();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (gameState.isPlaying) {
            gameState.keys[e.code] = false;
        }
    });

    // Add a window blur event to clear keys when user switches tabs/windows
    window.addEventListener('blur', () => {
        if (gameState.isPlaying) {
            clearKeyStates();
        }
    });

    // Initialize game
    initCanvas();
    updateHighScore();
    
    // Don't auto-focus on name input - let users discover the game naturally
    // The game should be passive until user interacts with it
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStarGame);
} else {
    // DOM is already loaded
    initializeStarGame();
}