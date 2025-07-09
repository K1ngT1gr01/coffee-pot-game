// Game State
let gameState = {
    currentScreen: 'loading',
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: false,
    betAmount: 1.00,
    totalWon: 0.00,
    coffeePotLevel: 0,
    maxLevel: 12,
    isPlaying: false,
    autoplayEnabled: false,
    currentPrizePage: 1,
    maxPrizePages: 2
};

// Game symbols
const symbols = ['☕', '🫘', '🥐', '🔔', '❤️'];

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // Show loading screen first
    showScreen('loading-screen');
    
    // Initialize game grid
    createGameGrid();
    
    // Initialize coffee pot fill levels
    createFillLevels();
    
    // Simulate loading
    setTimeout(() => {
        showScreen('sound-prompt');
    }, 3000);
}

function createGameGrid() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    
    // Create 3x5 grid (15 cells)
    for (let i = 0; i < 15; i++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        cell.id = `cell-${i}`;
        
        // Add random symbol
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        cell.textContent = randomSymbol;
        
        grid.appendChild(cell);
    }
}

function createFillLevels() {
    const fillLevels = document.getElementById('fill-levels');
    updateCoffeePotLevel();
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
    }
}

function enableSound(enabled) {
    gameState.soundEnabled = enabled;
    showScreen('main-game');
}

function adjustBet(change) {
    const newBet = gameState.betAmount + change;
    if (newBet >= 0.25 && newBet <= 10.00) {
        gameState.betAmount = newBet;
        document.getElementById('bet-amount').textContent = `$${gameState.betAmount.toFixed(2)}`;
    }
}

function playGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    const playBtn = document.getElementById('play-btn');
    playBtn.textContent = 'PLAYING...';
    playBtn.disabled = true;
    
    // Simulate game play
    setTimeout(() => {
        simulateGameRound();
        gameState.isPlaying = false;
        playBtn.textContent = 'PLAY';
        playBtn.disabled = false;
    }, 2000);
}

function simulateGameRound() {
    // Generate new symbols
    createGameGrid();
    
    // Simulate matches and wins
    const matchCount = Math.floor(Math.random() * 3) + 1; // 1-3 matches
    let roundWin = 0;
    
    for (let i = 0; i < matchCount; i++) {
        // Add to coffee pot
        if (gameState.coffeePotLevel < gameState.maxLevel) {
            gameState.coffeePotLevel++;
            updateCoffeePotLevel();
        }
        
        // Calculate win
        const symbolWin = gameState.betAmount * (Math.random() * 2 + 0.5);
        roundWin += symbolWin;
    }
    
    // Update total won
    gameState.totalWon += roundWin;
    document.getElementById('total-won').textContent = `$${gameState.totalWon.toFixed(2)}`;
    
    // Show win popup if there was a win
    if (roundWin > 0) {
        showWinPopup(roundWin);
    }
    
    // Check if coffee pot is full
    if (gameState.coffeePotLevel >= gameState.maxLevel) {
        setTimeout(() => {
            triggerBonusGame();
        }, 1000);
    }
}

function updateCoffeePotLevel() {
    const fillLevels = document.getElementById('fill-levels');
    const fillPercentage = (gameState.coffeePotLevel / gameState.maxLevel) * 100;
    fillLevels.style.height = `${fillPercentage}%`;
    
    // Update coffee pot expression
    updateCoffeePotExpression();
}

function updateCoffeePotExpression() {
    const mouth = document.getElementById('pot-mouth');
    const fillRatio = gameState.coffeePotLevel / gameState.maxLevel;
    
    if (fillRatio < 0.3) {
        mouth.className = 'mouth happy';
    } else if (fillRatio < 0.7) {
        mouth.className = 'mouth neutral';
    } else if (fillRatio < 1.0) {
        mouth.className = 'mouth angry';
    } else {
        mouth.className = 'mouth very-angry';
    }
}

function showWinPopup(amount) {
    const popup = document.createElement('div');
    popup.className = 'win-popup';
    popup.textContent = `+$${amount.toFixed(2)}`;
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #8B4513;
        padding: 1rem 2rem;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 1000;
        animation: winPopup 2s ease-out forwards;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

function triggerBonusGame() {
    // Reset coffee pot
    gameState.coffeePotLevel = 0;
    updateCoffeePotLevel();
    
    // Show bonus win
    const bonusWin = gameState.betAmount * 10;
    gameState.totalWon += bonusWin;
    document.getElementById('total-won').textContent = `$${gameState.totalWon.toFixed(2)}`;
    
    showWinPopup(bonusWin);
    
    // Coffee pot celebration animation
    const coffeePot = document.getElementById('coffee-pot');
    coffeePot.style.animation = 'celebrate 1s ease-in-out';
    
    setTimeout(() => {
        coffeePot.style.animation = '';
    }, 1000);
}

function toggleAutoplay() {
    gameState.autoplayEnabled = !gameState.autoplayEnabled;
    const autoBtn = document.getElementById('autoplay-btn');
    
    if (gameState.autoplayEnabled) {
        autoBtn.textContent = 'STOP';
        autoBtn.style.background = 'linear-gradient(135deg, #DC143C, #B22222)';
        startAutoplay();
    } else {
        autoBtn.textContent = 'AUTO';
        autoBtn.style.background = 'linear-gradient(135deg, #4169E1, #1E90FF)';
        stopAutoplay();
    }
}

function startAutoplay() {
    if (!gameState.autoplayEnabled || gameState.isPlaying) return;
    
    playGame();
    
    setTimeout(() => {
        if (gameState.autoplayEnabled) {
            startAutoplay();
        }
    }, 3000);
}

function stopAutoplay() {
    gameState.autoplayEnabled = false;
}

function showHowToPlay() {
    showScreen('how-to-play');
}

function showPrizeChart() {
    gameState.currentPrizePage = 1;
    updatePrizeChart();
    showScreen('prize-chart');
}

function showOptions() {
    // Update toggle states
    document.getElementById('sound-toggle').checked = gameState.soundEnabled;
    document.getElementById('music-toggle').checked = gameState.musicEnabled;
    document.getElementById('vibration-toggle').checked = gameState.vibrationEnabled;
    
    showScreen('options-menu');
}

function closeOverlay() {
    showScreen('main-game');
}

function nextPrizePage() {
    if (gameState.currentPrizePage < gameState.maxPrizePages) {
        gameState.currentPrizePage++;
        updatePrizeChart();
    }
}

function prevPrizePage() {
    if (gameState.currentPrizePage > 1) {
        gameState.currentPrizePage--;
        updatePrizeChart();
    }
}

function updatePrizeChart() {
    const pageIndicator = document.querySelector('.page-indicator');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    pageIndicator.textContent = `${gameState.currentPrizePage} / ${gameState.maxPrizePages}`;
    
    prevBtn.disabled = gameState.currentPrizePage === 1;
    nextBtn.disabled = gameState.currentPrizePage === gameState.maxPrizePages;
    
    // Update prize page content
    const prizePage = document.getElementById('prize-page-1');
    if (gameState.currentPrizePage === 2) {
        prizePage.innerHTML = `
            <h3>Bonus Features</h3>
            <div class="payout-table">
                <div class="payout-row">
                    <div class="symbol-combo">Full Pot</div>
                    <div class="payout">10x Bet</div>
                </div>
                <div class="payout-row">
                    <div class="symbol-combo">4+ Match</div>
                    <div class="payout">2x Payout</div>
                </div>
                <div class="payout-row">
                    <div class="symbol-combo">5+ Match</div>
                    <div class="payout">5x Payout</div>
                </div>
            </div>
        `;
    } else {
        prizePage.innerHTML = `
            <h3>Symbol Payouts</h3>
            <div class="payout-table">
                <div class="payout-row">
                    <div class="symbol-combo">☕☕☕</div>
                    <div class="payout">$5.00</div>
                </div>
                <div class="payout-row">
                    <div class="symbol-combo">🫘🫘🫘</div>
                    <div class="payout">$3.00</div>
                </div>
                <div class="payout-row">
                    <div class="symbol-combo">🥐🥐🥐</div>
                    <div class="payout">$2.50</div>
                </div>
                <div class="payout-row">
                    <div class="symbol-combo">🔔🔔🔔</div>
                    <div class="payout">$2.00</div>
                </div>
                <div class="payout-row">
                    <div class="symbol-combo">❤️❤️❤️</div>
                    <div class="payout">$1.50</div>
                </div>
            </div>
        `;
    }
}

// Add event listeners for options toggles
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const soundToggle = document.getElementById('sound-toggle');
        const musicToggle = document.getElementById('music-toggle');
        const vibrationToggle = document.getElementById('vibration-toggle');
        
        if (soundToggle) {
            soundToggle.addEventListener('change', function() {
                gameState.soundEnabled = this.checked;
            });
        }
        
        if (musicToggle) {
            musicToggle.addEventListener('change', function() {
                gameState.musicEnabled = this.checked;
            });
        }
        
        if (vibrationToggle) {
            vibrationToggle.addEventListener('change', function() {
                gameState.vibrationEnabled = this.checked;
            });
        }
    }, 100);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes winPopup {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes celebrate {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
    }
    
    .mouth.neutral {
        background: #000;
        border-radius: 20px;
        width: 20px;
        height: 3px;
    }
    
    .mouth.very-angry {
        background: #000;
        border-radius: 20px 20px 0 0;
        transform: rotate(180deg);
        width: 25px;
        height: 12px;
    }
`;
document.head.appendChild(style);


/*
Copyright (c) 2025 Muhammad Yasir Hussain. All rights reserved.
Any form of copying, reproduction, or unauthorized use of this code is strictly prohibited and will be penalized.
*/

