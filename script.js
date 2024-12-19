// Variables
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameContainer = document.getElementById('game-container');
const target = document.getElementById('target');
const scoreboard = document.getElementById('scoreboard');
const timerDisplay = document.getElementById('timer');
const scoreList = document.getElementById('score-list');
const nameInputDiv = document.getElementById('name-input');
const playerNameInput = document.getElementById('player-name');
const submitNameButton = document.getElementById('submit-name');
const popupBox = document.getElementById('popup-box');
const startPopup = document.getElementById('start-popup');
const endPopup = document.getElementById('end-popup');
const highScoreMessage = document.getElementById('high-score-message');

let score = 0;
let timeLeft = 30;
let timerInterval = null;
let totalClicks = 0;
let successfulHits = 0;
let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
let gameStarted = false;

// Top Scores
function displayTopScores() {
    scoreList.innerHTML = '';
    const sortedScores = topScores
        .sort((a, b) => b.level - a.level || b.accuracy - a.accuracy)
        .slice(0, 10);
    sortedScores.forEach(score => {
        const div = document.createElement('div');
        div.classList.add('score-entry');
        div.innerHTML = `
            <span>${score.level}</span>
            <span>${score.accuracy}%</span>
            <span>${score.name}</span>
        `;
        scoreList.appendChild(div);
    });
}

function updateHighScore() {
    const accuracy = totalClicks > 0 ? ((successfulHits / totalClicks) * 100).toFixed(2) : 0;
    if (
        topScores.length < 10 ||
        score > topScores[topScores.length - 1].level ||
        (score === topScores[topScores.length - 1].level && accuracy > topScores[topScores.length - 1].accuracy)
    ) {
        highScoreMessage.classList.remove('hidden');
        nameInputDiv.classList.remove('hidden');
    } else {
        restartButton.classList.remove('hidden');
    }
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endPopup.classList.remove('hidden');
            updateHighScore();
        }
    }, 1000);
}

// Gameplay
function moveTarget() {
    const maxWidth = gameContainer.clientWidth - target.clientWidth;
    const maxHeight = gameContainer.clientHeight - target.clientHeight;
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

target.addEventListener('click', () => {
    if (gameStarted) {
        score++;
        successfulHits++;
        totalClicks++;
        scoreboard.textContent = `Score: ${score}`;
        moveTarget();
    }
});

// Event Listeners
startButton.addEventListener('click', () => {
    popupBox.classList.add('hidden');
    startPopup.classList.add('hidden');
    gameStarted = true;
    moveTarget();
    startTimer();
});

restartButton.addEventListener('click', () => {
    score = 0;
    timeLeft = 30;
    totalClicks = 0;
    successfulHits = 0;
    scoreboard.textContent = `Score: 0`;
    timerDisplay.textContent = `Time: 30`;
    endPopup.classList.add('hidden');
    gameStarted = true;
    moveTarget();
    startTimer();
});

submitNameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName && /^[a-zA-Z0-9]+$/.test(playerName)) {
        const accuracy = totalClicks > 0 ? ((successfulHits / totalClicks) * 100).toFixed(2) : 0;
        topScores.push({ name: playerName, level: score, accuracy: accuracy });
        localStorage.setItem('topScores', JSON.stringify(topScores));
        displayTopScores();
        nameInputDiv.classList.add('hidden');
        restartButton.classList.remove('hidden');
    } else {
        alert('Please enter a valid name (letters and numbers only).');
    }
});

// Initial Load
displayTopScores();
