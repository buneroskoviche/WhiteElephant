const $gameBoard = $("#game-board");
const $randomizer = $("#randomizer");
const $randomizerBtn = $("#randomizer-btn");
const $playerTxt = $("#player-text");

const names = config.names;
const gifts = config.gifts;

const randomizeName = () => {
    // If there are no more names left, exit
    if(names.length < 1) {
        return "No more players left...";
    }
    // Generate a random number
    const num = Math.floor(Math.random() * names.length);
    // Splice the corresponding index in the names array
    const nextPlayer = names.splice(num, 1);
    // Return the player name
    return nextPlayer[0];
}

$randomizerBtn.on("click", function(event) {
    const next = randomizeName();
    $playerTxt.text(next);
    console.log(next);
});