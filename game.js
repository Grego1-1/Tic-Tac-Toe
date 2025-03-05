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
        if (!cells[index]) {
            cells[index] = currentPlayer;
            event.target.textContent = currentPlayer;
            event.target.classList.add("taken");

            if (checkWinner(currentPlayer)) {
                setTimeout(() => {
                    alert(`${currentPlayer} menang!`);
                    updateScore(currentPlayer);
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

            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
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
