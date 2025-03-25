const board = document.getElementById("board");
const statusText = document.getElementById("status");
const modeSelect = document.getElementById("mode");
let cells = [];
let currentPlayer = "X"; // "X" always starts
let gameActive = true;

// Winning combinations
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
];

// Create the board
function createBoard() {
    board.innerHTML = "";
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
        cells.push(cell);
    }
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Handle cell click
function handleClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    if (cell.textContent !== "") return;

    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    if (checkWin(currentPlayer)) {
        statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (cells.every(cell => cell.textContent !== "")) {
        statusText.textContent = "😮 It's a Draw!";
        gameActive = false;
        return;
    }

    // Switch Player or let AI move
    if (modeSelect.value === "human") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    } else {
        if (currentPlayer === "X") {
            currentPlayer = "O"; // Switch to AI
            setTimeout(aiMove, 500); // AI makes a move after 0.5 sec
        } else {
            currentPlayer = "X";
        }
    }

    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// AI makes a move
function aiMove() {
    if (!gameActive) return;

    let emptyCells = cells.filter(cell => cell.textContent === "");
    if (emptyCells.length === 0) return;

    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = "O";
    randomCell.classList.add("taken");

    if (checkWin("O")) {
        statusText.textContent = `🤖 AI Wins!`;
        gameActive = false;
        return;
    }

    if (cells.every(cell => cell.textContent !== "")) {
        statusText.textContent = "😮 It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Check win condition
function checkWin(player) {
    return winningCombos.some(combo =>
        combo.every(index => cells[index].textContent === player)
    );
}

// Reset game
function resetGame() {
    currentPlayer = "X";
    gameActive = true;
    createBoard();
}

// Start the game
createBoard();
