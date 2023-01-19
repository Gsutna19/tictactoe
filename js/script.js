
const Gameboard = (() => {
    const cellElements = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
            
    return {cellElements, board};
})();
// All the logic for the game
const gameLogic = (() => {
    let circleTurn
    let aiPlays
    const X_CLASS = 'x';
    const CIRCLE_CLASS = 'circle';
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    const winningMessageTextElement = document.querySelector('[data-winning-msg-txt]')
    const winningMessageElement = document.getElementById('winning-msg')
    const els = Gameboard.cellElements
    const playField = Gameboard.board
    const restartButton = document.getElementById('restartButton')
    const p1Name = document.getElementById('p1')
    const p2Name = document.getElementById('p2')
    const compBtn = document.getElementById("computer")
    // To reset board after a game is played.
    function startGame() {
        circleTurn = false;
        els.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(CIRCLE_CLASS)
            cell.removeEventListener('click', handleClick)
            cell.addEventListener('click', handleClick, {once: true })
        }) 
        setBoardHoverClass();
        winningMessageElement.classList.remove('show')
        winningMessageTextElement.classList.remove('draw')
        winningMessageTextElement.classList.remove('x')
        winningMessageTextElement.classList.remove('circle')
    }

    function restartGame() {
        restartButton.addEventListener('click', startGame)
    }

    function handleClick(e) {
        const cell = e.target
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
        // To start ai player
        if(aiPlays) {
            if(!cell.classList.contains(CIRCLE_CLASS)) {
                placeMark(cell, currentClass)
            } else if (cell.classList.contains(CIRCLE_CLASS)) {
                handleClick();
            }
            if(checkWin(currentClass)) {
                endGame(false)
            } else if (isDraw()) {
                endGame(true)
            } else {
                swapTurns();
                compPlayer();
            }
        } else {
            placeMark(cell, currentClass)
            if(checkWin(currentClass)) {
                endGame(false)
            } else if (isDraw()) {
                endGame(true)
            } else {
                swapTurns()
                setBoardHoverClass()
            }
        }
    }
    // Returns a value to indicate the state of the board
    function evaluate() {
        if(checkWin(X_CLASS)) {
            return 10;
        } else if (checkWin(CIRCLE_CLASS)) {
            return -10;
        } else if (isDraw()){
            return 0
        }
    }
    // MINMAX ALGORITHM
    // To find the best move possible
    function minmax(depth, isMax) {
        
        let score = evaluate();
        let freeSquares = emptySquares();

        if (score == 10) {
            return score;
        }
        if (score == -10) {
            return score;
        }
        if (freeSquares.length == 0) {
            return 0;
        }

        // If it's 'X' turn
        if(isMax) {
            let best = -10000;

            for (let i = 0; i < freeSquares.length; i++) {
                // If there are any free squares to play
                if(freeSquares.length > 0) {
                    freeSquares[i].classList.add(X_CLASS);
                    best = Math.max(best, minmax(depth + 1, !isMax));
                    // Undo the move
                    freeSquares[i].classList.remove(X_CLASS);
                }
            }
            return best;
        } 
        // If it's 'O' turn. P.S. AI is always Circle
        else {
            let best = 10000;
            
            for(let i = 0; i < freeSquares.length; i++) {
                if(freeSquares.length > 0) {
                    freeSquares[i].classList.add(CIRCLE_CLASS);
                    

                    best = Math.min(best, minmax(depth + 1, !isMax));
                    // Undo move
                    freeSquares[i].classList.remove(CIRCLE_CLASS);
                }

            }
            
            return best;
        }
    }
    // Calls minmax and plays best move.
    function bestMove() {
        let bestVal = 10000;
        let freeSquares = emptySquares();
        let cellId;
        
        for (i = 0; i < freeSquares.length; i++) {
            if(freeSquares.length > 0){
                freeSquares[i].classList.add(CIRCLE_CLASS);
                let moveVal = minmax(0, true);
                
                freeSquares[i].classList.remove(CIRCLE_CLASS);

                if(moveVal < bestVal) {
                    bestVal = moveVal;
                    cellId = freeSquares[i].id;
                    console.log(i)
                }
            }
        }
        // Return the optimal move cell and add the CIRCLE_CLASS to it.
        document.getElementById(cellId).classList.add(CIRCLE_CLASS);
    }
    // END MINMAX

    function endGame(draw) {
        if (draw) {
            winningMessageTextElement.innerText = "Draw!"
            winningMessageTextElement.classList.add('draw')

        } else {
            winningMessageTextElement.innerText = `${circleTurn ? p2Name.value : 
            p1Name.value} Wins!`
            winningMessageTextElement.classList.add(circleTurn ? "circle" : "x" )
        }
        winningMessageElement.classList.add('show')
    }
    function isDraw() {
        return [...els].every(cell => {
            return cell.classList.contains(X_CLASS) ||
            cell.classList.contains(CIRCLE_CLASS)
        })
    }
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass)
    }
    function swapTurns() {
        circleTurn = !circleTurn;
    }
    // To start AI thinking
    function playComp() {
        compBtn.addEventListener('click', compPlayer)
    }
    function compPlayer() {
        aiPlays = true;
        // button
        compBtn.innerText = "Evil PC"
        const p2Name = document.getElementById("p2");
        p2Name.value = "Evil PC"

        // Start AI thinking
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

        if(circleTurn) {
            bestMove()
            if(checkWin(currentClass)) {
                endGame(false)
            } else if (isDraw()) {
                endGame(true)
            } else {
                swapTurns()
                setBoardHoverClass()
            }
        }
    }
    // Iterate through gameboard array, get indexes of spots
    // without X_CLASS and CIRCLE_CLASS
    function emptySquares() {
        return [...els].filter(cellClass => !cellClass.classList.contains(X_CLASS) && 
        !cellClass.classList.contains(CIRCLE_CLASS))
    }
    function setBoardHoverClass() {
        playField.classList.remove(X_CLASS)
        playField.classList.remove(CIRCLE_CLASS)
        if (circleTurn) {
            playField.classList.add(CIRCLE_CLASS)
        } else {
            playField.classList.add(X_CLASS)
        }
    }
    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return els[index].classList.contains(currentClass)
            })
        })
    }

    return { start: startGame(), restart: restartGame(), playAI: playComp(), aiPlayer: function(x) {return aiPlays;} }
})();

const displaySetPlayerName = (() => {
    const btn = document.getElementById('player')
    const names = document.getElementById('names')
    function displaySetName() {
        btn.addEventListener('click', nameBtnClick)
    }

    function nameBtnClick() {
        names.classList.add('show')
    }
    
    return { display: displaySetName(), names }
})();

const setName = (() => {
    const startBtn = document.getElementById("play")
    const plBtn = document.getElementById("player")
    const compBtn = document.getElementById("computer")
    let name1
    let name2

    function startClick() {
        startBtn.addEventListener('click', startBtnClick)
    }

    function startBtnClick() {
        const p1Name = document.getElementById("p1").value;
        let p2Name = document.getElementById("p2");
        if (gameLogic.aiPlayer()) {
            p2Name.value = "Evil PC"
        } else {
            p2Name = document.getElementById("p2").value;
        }
        const p1 = p1Name

        displaySetPlayerName.names.classList.remove('show')
        changeBtnDisplay(p1Name, p2Name)
    }

    function changeBtnDisplay(p1, p2) {
        plBtn.innerText = p1
        name1 = p1
        if(gameLogic.aiPlayer()){
            compBtn.innerText = "Evil PC"
            name2 = "Evil PC"
        } else {
            compBtn.innerText = p2
            name2 = p2
        }
        
        plBtn.addEventListener("mouseover", handleMouseover)
        compBtn.addEventListener("mouseover", handleMouseover)
        plBtn.addEventListener("mouseout", handleMouseout)
        compBtn.addEventListener("mouseout", handleMouseout)
    }

    function handleMouseover() {
        plBtn.innerText = "Change names"
        if(gameLogic.aiPlayer()) {
            compBtn.innerText = "Can't change my Evil name!"
        } else {
            compBtn.innerText = "Play Computer"
        }
    }

    function handleMouseout() {
        plBtn.innerText = name1
        if(gameLogic.aiPlayer()){
            compBtn.innerText = "Evil PC"
        } else {
            compBtn.innerText = name2
        }
    }

    return { name: startClick() }
})();