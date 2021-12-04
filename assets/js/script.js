const $gameBoard = $("#game-board");
const $randomizer = $("#randomizer");
const $randomizerBtn = $("#randomizer-btn");
const $playerTxt = $("#player-text");

const names = config.names;
const gifts = config.gifts;

const randomizePlayer = () => {
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

$randomizerBtn.on("click", () => {
    const next = randomizePlayer();
    $playerTxt.text(next);
});

$gameBoard.on("click", function(event) {
    const element = event.target;
    if(element.matches('.tile')) {
        const id = element.getAttribute('id');
        const bkg = element.getAttribute('data-bkg');
        $(`#${id}`).attr('style', `background-image: url("${bkg}")`)
    }
})