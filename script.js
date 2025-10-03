'use strict';

// Game state variables
let currentPlayer = 1;
let totalScores = [0, 0];
let currentScores = [0, 0];
let gameActive = true;

// DOM elements
const totalScore1 = document.getElementById('total-1');
const totalScore2 = document.getElementById('total-2');
const currentScore1 = document.getElementById('current-1');
const currentScore2 = document.getElementById('current-2');
const player1 = document.querySelector('.player-1');
const player2 = document.querySelector('.player-2');
const dice = document.getElementById('dice');
const diceNumber = document.getElementById('dice-number');
const btnRoll = document.getElementById('btn-roll');
const btnHold = document.getElementById('btn-hold');
const btnNew = document.getElementById('btn-new');
const gameStatus = document.getElementById('game-status');
const winnerModal = document.getElementById('winner-modal');
const winnerText = document.getElementById('winner-text');

// Dice face emojis
const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

// Initialize game
function init() {
    currentPlayer = 1;
    totalScores = [0, 0];
    currentScores = [0, 0];
    gameActive = true;
    
    // Reset display
    totalScore1.textContent = '0';
    totalScore2.textContent = '0';
    currentScore1.textContent = '0';
    currentScore2.textContent = '0';
    
    // Reset dice
    dice.textContent = '🎲';
    diceNumber.textContent = '-';
    
    // Set initial active player
    player1.classList.add('active');
    player2.classList.remove('active');
    
    // Enable buttons
    btnRoll.disabled = false;
    btnHold.disabled = false;
    
    // Update game status
    gameStatus.textContent = "Player 1's Turn";
    
    // Hide winner modal
    winnerModal.classList.remove('show');
}

// Switch to next player
function switchPlayer() {
    // Reset current player's round score
    currentScores[currentPlayer - 1] = 0;
    document.getElementById(`current-${currentPlayer}`).textContent = '0';
    
    // Switch active player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    
    // Update UI
    player1.classList.toggle('active');
    player2.classList.toggle('active');
    
    // Update game status
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
}

// Roll dice function
function rollDice() {
    if (!gameActive) return;
    
    // Generate random number between 1 and 6
    const diceValue = Math.random() < 0.5 ? 
        Math.floor(Math.random() * 6) + 1 : 
        Math.floor(Math.random() * 6) + 1;
    
    // Add rolling animation
    dice.classList.add('rolling');
    
    setTimeout(() => {
        // Update dice display
        dice.textContent = diceEmojis[diceValue];
        diceNumber.textContent = diceValue;
        dice.classList.remove('rolling');
        
        // Check if rolled a 1
        if (diceValue === 1) {
            // Player loses all current round points and turn ends
            gameStatus.textContent = `Player ${currentPlayer} rolled a 1! Turn over!`;
            
            // Add a brief delay before switching players
            setTimeout(() => {
                switchPlayer();
            }, 1500);
        } else {
            // Add to current round score (2, 3, 4, 5, or 6)
            currentScores[currentPlayer - 1] += diceValue;
            document.getElementById(`current-${currentPlayer}`).textContent = currentScores[currentPlayer - 1];
            
            gameStatus.textContent = `Player ${currentPlayer} rolled a ${diceValue}! Keep rolling or hold?`;
        }
    }, 500);
}

// Hold current score
function holdScore() {
    if (!gameActive) return;
    
    // Add current round score to total score
    totalScores[currentPlayer - 1] += currentScores[currentPlayer - 1];
    document.getElementById(`total-${currentPlayer}`).textContent = totalScores[currentPlayer - 1];
    
    // Check if player won (reached 100 or more)
    if (totalScores[currentPlayer - 1] >= 100) {
        // Player wins!
        gameActive = false;
        btnRoll.disabled = true;
        btnHold.disabled = true;
        
        // Show winner
        winnerText.textContent = `🎉 Player ${currentPlayer} Wins! 🎉`;
        winnerModal.classList.add('show');
        gameStatus.textContent = `Player ${currentPlayer} won with ${totalScores[currentPlayer - 1]} points!`;
        
        // Add winner styling
        document.querySelector(`.player-${currentPlayer}`).style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        document.querySelector(`.player-${currentPlayer}`).style.color = 'white';
        
    } else {
        // Switch to next player
        gameStatus.textContent = `Player ${currentPlayer} held ${currentScores[currentPlayer - 1]} points!`;
        
        setTimeout(() => {
            switchPlayer();
        }, 1000);
    }
}

// Start new game
function newGame() {
    // Reset player styling
    player1.style.background = '';
    player1.style.color = '';
    player2.style.background = '';
    player2.style.color = '';
    
    init();
}

// Event listeners
btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', holdScore);
btnNew.addEventListener('click', newGame);

// Allow clicking on dice to roll
dice.addEventListener('click', function() {
    if (gameActive && !btnRoll.disabled) {
        rollDice();
    }
});

// Keyboard controls
document.addEventListener('keydown', function(e) {
    if (!gameActive) return;
    
    switch(e.code) {
        case 'Space':
        case 'Enter':
            e.preventDefault();
            rollDice();
            break;
        case 'KeyH':
            holdScore();
            break;
        case 'KeyN':
            newGame();
            break;
    }
});

// Initialize game on page load
init();

// Add some additional game statistics tracking
let gameStats = {
    totalGames: 0,
    player1Wins: 0,
    player2Wins: 0,
    rollsThisGame: 0
};

// Enhanced roll function with statistics
const originalRollDice = rollDice;
rollDice = function() {
    gameStats.rollsThisGame++;
    originalRollDice();
};

// Enhanced new game function with statistics
const originalNewGame = newGame;
newGame = function() {
    if (!gameActive && (totalScores[0] >= 100 || totalScores[1] >= 100)) {
        gameStats.totalGames++;
        if (totalScores[0] >= 100) gameStats.player1Wins++;
        if (totalScores[1] >= 100) gameStats.player2Wins++;
    }
    gameStats.rollsThisGame = 0;
    originalNewGame();
};

// Console commands for debugging (optional)
window.gameDebug = {
    getStats: () => gameStats,
    getCurrentState: () => ({
        currentPlayer,
        totalScores: [...totalScores],
        currentScores: [...currentScores],
        gameActive
    }),
    setScore: (player, score) => {
        if (player === 1 || player === 2) {
            totalScores[player - 1] = score;
            document.getElementById(`total-${player}`).textContent = score;
        }
    }
};
