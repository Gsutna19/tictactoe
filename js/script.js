
const Gameboard = (() => {
    // Is it ok to have gameboard be public??
    const gameboard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const cellElements = document.querySelectorAll('[data-cell]');
    // cellElements.forEach(cell => {
    //     cell.addEventListener('click', handleClick, {once: true })
    // })

    // function handleClick(e) {
    //     console.log('clicked')
    // }

    return {gameboard, cellElements};
})();
    
const gameLogic = (() => {
    const els = Gameboard.cellElements
    els.forEach(cell => {
        cell.addEventListener('click', handleClick, {once: true })
    })
    function handleClick(e) {
        console.log('clicked')
        const X_CLASS = 'x';
        const CIRCLE_CLASS = 'circle';
        let circleTurn
        const cell = e.target
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

        placeMark(cell, currentClass)
        
    }
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass)
    }
})();
    
const playerFactory = (name, mark) => {
    return {name, mark};
};
    


// const jeff = playerFactory('jeff', 'X');

// console.log(jeff);
console.log(Gameboard.gameboard, Gameboard.handleClick)