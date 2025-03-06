document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const resetButton = document.getElementById("reset");
    const resetScoreButton = document.getElementById("reset-score");
    const scoreXDisplay = document.getElementById("score-x");
    const scoreODisplay = document.getElementById("score-o");
    const scoreDrawDisplay = document.getElementById("score-draw");

    let cells = Array(9).fill(null);
    let currentPlayer = "X";
    let scoreX = 0, scoreO = 0, scoreDraw = 0;

    function createBoard() {
        board.innerHTML = "";
        cells = Array(9).fill(null);
        currentPlayer = "X";

        cells.forEach((_, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = index;
            cell.addEventListener("click", handleMove);
            board.appendChild(cell);
        });
    }

    function handleMove(event) {
        const index = event.target.dataset.index;
        if (!cells[index] && currentPlayer === "X") {
            cells[index] = "X";
            event.target.textContent = "X";
            event.target.classList.add("taken");

            if (checkWinner("X")) {
                setTimeout(() => {
                    alert("Player (X) menang!");
                    updateScore("X");
                    resetGame();
                }, 300);
                return;
            } else if (!cells.includes(null)) {
                setTimeout(() => {
                    alert("Seri!");
                    updateScore("draw");
                    resetGame();
                }, 300);
                return;
            }

            currentPlayer = "O";
            setTimeout(botMove, 500);
        }
    }

    function botMove() {
        let availableMoves = cells.map((v, i) => (v === null ? i : null)).filter(v => v !== null);
        
        // Bot mencoba menang atau mencegah kekalahan
        let move = findBestMove("O") || findBestMove("X") || getRandomMove(availableMoves);
        
        if (move !== null) {
            cells[move] = "O";
            board.children[move].textContent = "O";
            board.children[move].classList.add("taken");

            if (checkWinner("O")) {
                setTimeout(() => {
                    alert("Bot (O) menang!");
                    updateScore("O");
                    resetGame();
                }, 300);
                return;
            } else if (!cells.includes(null)) {
                setTimeout(() => {
                    alert("Seri!");
                    updateScore("draw");
                    resetGame();
                }, 300);
                return;
            }

            currentPlayer = "X";
        }
    }

    function findBestMove(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let pattern of winPatterns) {
            let values = pattern.map(index => cells[index]);
            let emptyIndex = pattern.find(index => cells[index] === null);

            if (values.filter(v => v === player).length === 2 && emptyIndex !== undefined) {
                return emptyIndex; // Jika bisa menang atau harus bertahan, pilih langkah ini
            }
        }
        return null; // Tidak ada langkah terbaik
    }

    function getRandomMove(availableMoves) {
        return availableMoves.length ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
    }

    function checkWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => cells[index] === player));
    }

    function updateScore(winner) {
        if (winner === "X") scoreX++;
        else if (winner === "O") scoreO++;
        else scoreDraw++;

        scoreXDisplay.textContent = scoreX;
        scoreODisplay.textContent = scoreO;
        scoreDrawDisplay.textContent = scoreDraw;
    }

    function resetGame() {
        createBoard();
    }

    function resetScore() {
        scoreX = 0;
        scoreO = 0;
        scoreDraw = 0;
        resetGame();
        scoreXDisplay.textContent = scoreX;
        scoreODisplay.textContent = scoreO;
        scoreDrawDisplay.textContent = scoreDraw;
    }

    resetButton.addEventListener("click", resetGame);
    resetScoreButton.addEventListener("click", resetScore);
    createBoard();
});
