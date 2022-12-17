const Gameboard = (() => {
    let gameboard = [];

    return {
        gameboard
    };
})();

const Player = (name) => {
    let name = name;
    return {name};
}

const Player2 = (name) => {

    const {name} = Player(name);
    let placeMark = "x";
}
// console.log("It's connected!")