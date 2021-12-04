const $gameBoard = $("#game-board");
const $randomizer = $("#randomizer");
const $randomizerBtn = $("#randomizer-btn");
const $playerTxt = $("#player-text");

const names = config.names;
const gifts = config.gifts;

const appendTile = (object, number) => {
    // Create the tile
    const $tile = $("<div>").addClass("tile")
        .attr('data-steals', 0)
        .attr('data-bkg', `./assets/Images/${object.image}`)
        .attr('id', `tile-${number}`);
    // Create the title tag
    const title = $("<h5>").text(object.title);
    // Create the owner tag
    const owner = $("<h5>").text('Owner: ');
    // Create the owner span
    const ownerSpan = $("<span>").addClass('owner')
    // Put the owner span in the owner tag
    owner.append(ownerSpan);
    // Put the title and the owner in the tile
    $tile.append(title).append(owner).children().addClass('d-none');
    // Add the tile to the list
    $gameBoard.append($tile);
}

// Append tiles for each gift
for (let i = 0; i < gifts.length; i++) {
    appendTile(gifts[i], i + 1);
}

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
        if(!element.classList.contains('claimed')) {
            const bkg = element.getAttribute('data-bkg');
            $(`#${id}`).css('background-image', `url("${bkg}")`).addClass('claimed');
            $(`#${id}`).children('h5').removeClass('d-none');
        } else {
            console.log('stolen!!')
        }
    }
})