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
            setTimeout(botMove, 300);
        }
    }

    function botMove() {
        let bestMove = minimax(cells, "O").index;
        if (bestMove !== undefined) {
            cells[bestMove] = "O";
            board.children[bestMove].textContent = "O";
            board.children[bestMove].classList.add("taken");

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

    function minimax(boardState, player) {
        const availableSpots = boardState.map((v, i) => (v === null ? i : null)).filter(v => v !== null);

        if (checkWinner("X")) return { score: -10 };
        if (checkWinner("O")) return { score: 10 };
        if (availableSpots.length === 0) return { score: 0 };

        let moves = [];
        for (let i of availableSpots) {
            let move = {};
            move.index = i;
            boardState[i] = player;

            if (player === "O") {
                move.score = minimax(boardState, "X").score;
            } else {
                move.score = minimax(boardState, "O").score;
            }

            boardState[i] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === "O") {
            let bestScore = -Infinity;
            for (let move of moves) {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let move of moves) {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        }
        return bestMove;
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
