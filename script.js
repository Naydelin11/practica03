let board, rows, cols, mines;
let firstClick = true;
let gameOver = false; 
const difficultyLevels = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 20 },
    hard: { rows: 16, cols: 16, mines: 40 },
    "very-hard": { rows: 20, cols: 20, mines: 60 },
    hardcore: { rows: 24, cols: 24, mines: 99 }
};

function toggleCustomSettings() {
    const customSettings = document.getElementById('custom-settings');
    customSettings.style.display = document.getElementById('difficulty').value === 'custom' ? 'block' : 'none';
}

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === 'custom') {
        rows = parseInt(document.getElementById('rows').value);
        cols = parseInt(document.getElementById('cols').value);
        mines = parseInt(document.getElementById('mines').value);
    } else {
        ({ rows, cols, mines } = difficultyLevels[difficulty]);
    }

    firstClick = true;
    gameOver = false; 
    initializeBoard();
    renderBoard();
}

function initializeBoard() {
    board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            revealed: false,
            count: 0
        }))
    );
}

function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => revealCell(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function revealCell(row, col) {
    if (gameOver || board[row][col].revealed) return; 

    if (firstClick) {
        placeMines(row, col);
        firstClick = false;
    }

    board[row][col].revealed = true;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('revealed');

    if (board[row][col].mine) {
        cell.textContent = "💣";
        alert("¡Perdiste! Has seleccionado una mina.");
        revealAllMines();
        gameOver = true; 
        return; 
    }

    const mineCount = countMinesAround(row, col);
    board[row][col].count = mineCount;

    if (mineCount > 0) {
        cell.textContent = mineCount;
    } else {
        revealAdjacentCells(row, col);
    }

    checkWin();
}

function revealAllMines() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col].mine) {
                const mineCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                mineCell.textContent = "💣";
            }
        }
    }
}

function countMinesAround(row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealAdjacentCells(row, col) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !board[newRow][newCol].revealed) {
                revealCell(newRow, newCol);
            }
        }
    }
}

function checkWin() {
    const totalCells = rows * cols;
    const revealedCells = board.flat().filter(cell => cell.revealed).length;
    const totalMines = board.flat().filter(cell => cell.mine).length;

    if (revealedCells === totalCells - totalMines) {
        alert("¡Felicidades, has ganado!");
        gameOver = true; 
    }
}

function placeMines(excludeRow, excludeCol) {
    let placedMines = 0;
    while (placedMines < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine && !(r === excludeRow && c === excludeCol)) {
            board[r][c].mine = true;
            placedMines++;
        }
    }
}
