
const Gameboard = (() => {
    // Is it ok to have gameboard be public??
    const gameboard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const cellElements = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
    // cellElements.forEach(cell => {
        //     cell.addEventListener('click', handleClick, {once: true })
        // })
        
        // function handleClick(e) {
            //     console.log('clicked')
            // }
            
    return {gameboard, cellElements, board};
})();
        
const gameLogic = (() => {
    let circleTurn
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
        console.log(circleTurn)
        const cell = e.target
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

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
    function endGame(draw) {
        if (draw) {
            winningMessageTextElement.innerText = "Draw!"
            winningMessageTextElement.classList.add('draw')

        } else {
            winningMessageTextElement.innerText = `${circleTurn ? "0's" : 
            "X's"} Wins!`
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

    return { start: startGame(), restart: restartGame() }
})();
    
const playerFactory = (name, mark) => {
    
    return {name, mark};
};

function setName() {

    const pName = document.getElementById('p1').value;
}
// console.log(pName)


// const jeff = playerFactory('jeff', 'X');
// console.log(jeff);

console.log(Gameboard.gameboard, Gameboard.handleClick)