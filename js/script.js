
const Gameboard = (() => {

    const cellElements = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
            
    return {cellElements, board};
})();
        
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
        console.log(bestSpot())
        const cell = e.target
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

        if(aiPlays) {
            // console.log(aiPlays)
            placeMark(cell, currentClass)
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
    // MINMAX ALGORITHM
    function bestSpot() {
        return minmax([...els], X_CLASS).index;
    }
    function minmax(newBoard, mark) {
        let availableSpots = emptySquares();
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

        if (checkWin(X_CLASS)) {
            return {score: -10};
        } else if (checkWin(CIRCLE_CLASS)) {
            return {score: 10};
        } else if (availableSpots.length === 0) {
            return {score: 0}
        }

        let moves = [];
        for (let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = newBoard[availableSpots[i]];
            newBoard[availableSpots[i]] = mark;

            if (mark == X_CLASS) {
                let result = minmax(newBoard, CIRCLE_CLASS);
                move.score = result.score;
            } else {
                let result = minmax(newBoard, X_CLASS);
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = move.index;

            move.push(move);
        }

        let bestMove;
        if(mark === X_CLASS) {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function endGame(draw) {
        if (draw) {
            winningMessageTextElement.innerText = "Draw!"
            winningMessageTextElement.classList.add('draw')
            // aiPlays = false;

        } else {
            winningMessageTextElement.innerText = `${circleTurn ? p2Name.value : 
            p1Name.value} Wins!`
            winningMessageTextElement.classList.add(circleTurn ? "circle" : "x" )
            // aiPlays = false;
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
    function playComp() {
        compBtn.addEventListener('click', compPlayer)
    }
    function compPlayer() {
        aiPlays = true;
        // button
        compBtn.innerText = "Evil PC"
        const p2Name = document.getElementById("p2");
        p2Name.value = "Evil PC"

        // compBtn.classList.add("white")
        // Start AI thinking
        let freeSpots = emptySquares();
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

        // console.log(freeSpots)
        if(circleTurn) {
            freeSpots[0].classList.add(CIRCLE_CLASS)
            if(checkWin(currentClass)) {
                endGame(false)
            } else if (isDraw()) {
                endGame(true)
            } else {
                swapTurns()
                setBoardHoverClass()
            }
        }

        // SET COMPUTER'S NAME

        // AI takes 2nd turn
    }
    function emptySquares() {
        return [...els].filter(cellClass => !cellClass.classList.contains(X_CLASS) && 
        !cellClass.classList.contains(CIRCLE_CLASS))
    }
    // Iterate through gameboard array, get indexes of spots
    // without X_CLASS and CIRCLE_CLASS
    // console.log(emptySquares())
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

// AI Logic
// const playAI = (() => {
//     const btn = document.getElementById("computer")
//     function playComp() {
//         btn.addEventListener('click', aiPlayer)
//     }
//     function aiPlayer(e) {
//         const button = e.target
//         // Testing button
//         btn.classList.add("white")
//         // Place Circle Mark
//         board = gameLogic.els
//         console.log(board)
//         // Start AI thinking
//         for (let i = 0; i < board.length; i++) {
//             if( !board[i].classList.contains(gameLogic.X_CLASS) ) {
//                 board[i].classList.add(gameLogic.CIRCLE_CLASS)
//             }
//         }

//         // AI takes 2nd turn
//     }

//     return { play: playComp() }

// })();
const displaySetPlayerName = (() => {
    const btn = document.getElementById('player')
    const names = document.getElementById('names')
    function displaySetName() {
        btn.addEventListener('click', nameBtnClick)
    }

    function nameBtnClick(e) {
        const button = e.target
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

    function startBtnClick(e) {
        const p1Name = document.getElementById("p1").value;
        const p2Name = document.getElementById("p2");
        if (gameLogic.aiPlayer()) {
            p2Name.value = "Evil PC"
        } else {
            p2Name = p2Name.value
        }
        const p1 = p1Name
        const button = e.target

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

    function handleMouseover(e) {
        console.log(gameLogic.aiPlayer())
        const button = e.target
        plBtn.innerText = "Change names"
        if(gameLogic.aiPlayer()) {
            compBtn.innerText = "Can't change my Evil name!"
        } else {
            compBtn.innerText = "Play Computer"
        }
    }

    function handleMouseout(e) {
        const button = e.target
        plBtn.innerText = name1
        compBtn.innerText = name2
    }

    return { name: startClick() }
})();