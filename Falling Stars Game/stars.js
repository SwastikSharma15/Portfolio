function initializeStarGame() {
    // Game state variables
    let gameState = {
        isPlaying: false,
        score: 0,
        timeLeft: 45,
        playerName: '',
        deviceType: '', // 'desktop' or 'mobile'
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
        highScoreInfo: document.getElementById('highScoreInfo'),
        playerGreeting: document.getElementById('playerGreeting'),
        celebrationMessage: document.getElementById('celebrationMessage'),
        playAgainBtn: document.getElementById('playAgainBtn'),
        desktopOption: document.getElementById('desktopOption'),
        mobileOption: document.getElementById('mobileOption'),
        controlInstructions: document.getElementById('controlInstructions'),
        mobileControls: document.getElementById('mobileControls'),
        leftBtn: document.getElementById('leftBtn'),
        rightBtn: document.getElementById('rightBtn')
    };

    // Check if all elements exist
    const missingElements = Object.keys(elements).filter(key => !elements[key]);
    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
        return;
    }

    const canvas = elements.gameCanvas;
    const ctx = canvas.getContext('2d');
    const gameContainer = document.querySelector('.star-game-container');

    // Initialize canvas size
    function initCanvas() {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        gameState.basket.y = canvas.height - 50;
    }

    // Load high score from memory (session-based) with default of 60
    function loadHighScore() {
        try {
            const saved = sessionStorage.getItem('starCatcherHighScore');
            return saved ? parseInt(saved) : 60; // Default high score is 60
        } catch (e) {
            return 60;
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

    // Device selection handlers
    function selectDevice(deviceType) {
        gameState.deviceType = deviceType;
        
        // Update UI
        elements.desktopOption.classList.remove('selected');
        elements.mobileOption.classList.remove('selected');
        
        if (deviceType === 'desktop') {
            elements.desktopOption.classList.add('selected');
            elements.controlInstructions.innerHTML = 'Use <strong>A & D</strong> keys or <strong>← & →</strong> arrow keys to move your basket';
        } else {
            elements.mobileOption.classList.add('selected');
            elements.controlInstructions.innerHTML = 'Use the <strong>on-screen buttons</strong> to move your basket left and right';
        }
        
        // Enable start button
        elements.startBtn.disabled = false;
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
        // Move basket based on input
        const moveSpeed = 8;
        
        if (gameState.deviceType === 'desktop') {
            // Keyboard controls for desktop
            if ((gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) && gameState.basket.x > 0) {
                gameState.basket.x -= moveSpeed;
            }
            if ((gameState.keys['ArrowRight'] || gameState.keys['KeyD']) && gameState.basket.x < canvas.width - gameState.basket.width) {
                gameState.basket.x += moveSpeed;
            }
        } else {
            // Mobile touch controls
            if (gameState.keys['mobile-left'] && gameState.basket.x > 0) {
                gameState.basket.x -= moveSpeed;
            }
            if (gameState.keys['mobile-right'] && gameState.basket.x < canvas.width - gameState.basket.width) {
                gameState.basket.x += moveSpeed;
            }
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

        // Gradual difficulty increase over time
        const elapsedTime = 45 - gameState.timeLeft;
        const progressRatio = elapsedTime / 45; // 0 to 1 over 45 seconds
        
        // Gradually increase star speed from 2 to 6 over the course of the game
        const baseSpeed = 2;
        const maxSpeed = 6;
        gameState.starSpeed = baseSpeed + (maxSpeed - baseSpeed) * progressRatio;
        
        // Gradually increase spawn rate from 0.02 to 0.05 over the course of the game
        const baseSpawnRate = 0.02;
        const maxSpawnRate = 0.05;
        gameState.spawnRate = baseSpawnRate + (maxSpawnRate - baseSpawnRate) * progressRatio;
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
        if (!gameState.deviceType) return;
        
        console.log('Starting game...'); // Debug log
        gameState.playerName = elements.playerName.value.trim() || 'Player';
        gameState.isPlaying = true;
        gameState.score = 0;
        gameState.timeLeft = 45;
        gameState.stars = [];
        gameState.starSpeed = 2;
        gameState.spawnRate = 0.02;
        gameState.basket.x = (canvas.width - gameState.basket.width) / 2;
        
        // Clear keyboard states at game start
        clearKeyStates();

        // Hide start screen, show game elements
        elements.startScreen.style.display = 'none';
        elements.gameHud.style.display = 'flex';
        elements.gameTimer.style.display = 'block';
        elements.gameCanvas.style.display = 'block';
        
        // Show mobile controls if mobile device selected
        if (gameState.deviceType === 'mobile') {
            elements.mobileControls.classList.add('show');
        }

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

        // Hide mobile controls
        elements.mobileControls.classList.remove('show');

        // Get current high score and check if player beat it
        const currentHighScore = loadHighScore();
        const isNewHighScore = gameState.score > currentHighScore;
        
        // Update final score text
        elements.finalScore.textContent = `Your Final Score: ${gameState.score}`;
        
        // Update high score info and celebration message
        if (isNewHighScore) {
            // Save new high score
            saveHighScore(gameState.score);
            elements.highScoreInfo.textContent = `Current Highest Score: ${gameState.score}`;
            elements.celebrationMessage.innerHTML = `🎉 CONGRATULATIONS! 🎉<br>NEW HIGH SCORE!<br>🌟 Amazing work, ${gameState.playerName}! 🌟`;
        } else {
            elements.highScoreInfo.textContent = `Current Highest Score: ${currentHighScore}`;
            elements.celebrationMessage.textContent = '';
        }
        
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
        elements.mobileControls.classList.remove('show');
        elements.startScreen.style.display = 'flex';
        elements.playerName.focus();
    }

    // Event listeners for device selection
    elements.desktopOption.addEventListener('click', () => selectDevice('desktop'));
    elements.mobileOption.addEventListener('click', () => selectDevice('mobile'));

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
            if (!elements.startBtn.disabled) {
                startGame();
            }
        }
    });

    // Mobile button controls
    elements.leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState.isPlaying) {
            gameState.keys['mobile-left'] = true;
        }
    });

    elements.leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        gameState.keys['mobile-left'] = false;
    });

    elements.rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState.isPlaying) {
            gameState.keys['mobile-right'] = true;
        }
    });

    elements.rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        gameState.keys['mobile-right'] = false;
    });

    // Also support mouse events for mobile buttons (for testing)
    elements.leftBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (gameState.isPlaying && gameState.deviceType === 'mobile') {
            gameState.keys['mobile-left'] = true;
        }
    });

    elements.leftBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        gameState.keys['mobile-left'] = false;
    });

    elements.rightBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (gameState.isPlaying && gameState.deviceType === 'mobile') {
            gameState.keys['mobile-right'] = true;
        }
    });

    elements.rightBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        gameState.keys['mobile-right'] = false;
    });

    // Keyboard controls - only work for desktop
    document.addEventListener('keydown', (e) => {
        if (gameState.isPlaying && gameState.deviceType === 'desktop') {
            gameState.keys[e.code] = true;
            
            // Prevent arrow keys and A/D keys from scrolling the page during gameplay
            if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
                e.preventDefault();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (gameState.isPlaying && gameState.deviceType === 'desktop') {
            gameState.keys[e.code] = false;
        }
    });

    // Add a window blur event to clear keys when user switches tabs/windows
    window.addEventListener('blur', () => {
        if (gameState.isPlaying) {
            clearKeyStates();
        }
    });

    // Prevent context menu on mobile buttons
    elements.leftBtn.addEventListener('contextmenu', (e) => e.preventDefault());
    elements.rightBtn.addEventListener('contextmenu', (e) => e.preventDefault());

    // Initialize game
    initCanvas();
    updateHighScore();

    // Add resize listener
    window.addEventListener('resize', () => {
        initCanvas();
        if (gameState.isPlaying) {
            renderGame(); // Redraw game if in progress
        } else {
            drawBasket(); // Redraw basket on start screen
        }
    });
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStarGame);
} else {
    // DOM is already loaded
    initializeStarGame();
}
