const $gameBoard = $("#game-board");
const $randomizer = $("#randomizer");
const $randomizerBtn = $("#randomizer-btn");
const $playerTxt = $("#player-text");

const names = config.names;
const gifts = config.gifts;

const appendTile = (object, number) => {
    // Create the tile
    const $tile = $("<div>").addClass("tile border unclaimed")
        .attr('data-bkg', `./assets/Images/${object.image}`)
        .attr('id', number);
    // Create the owner tag
    const owner = $("<p>").text('Owner: ').addClass('owner');
    // Create the owner span
    const ownerSpan = $("<span>").addClass('owner-text')
    // Put the owner span in the owner tag
    owner.append(ownerSpan);
    // Put the title and the owner in the tile
    $tile.append(owner).children().addClass('d-none');
    // Add the tile to the list
    $gameBoard.append($tile);
}

// Append tiles for each gift
for (let i = 0; i < gifts.length; i++) {
    appendTile(gifts[i], i + 1);
}

// This function chooses the next player randomly
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

// This is the function for the next player button
$randomizerBtn.on("click", () => {
    const next = randomizePlayer();
    $playerTxt.text(next);
});

// Function for the game board
$gameBoard.on("click", function(event) {
    const element = event.target;
    const classes = element.classList
    const tileStatus = classes[classes.length - 1];
    const id = element.getAttribute('id');

    // Determine the next action based on the status of the tile clicked
    switch(tileStatus) {
        case 'unclaimed':
            // Unhide elements
            const bkg = element.getAttribute('data-bkg');
            $(`#${id}`).css('background-image', `url("${bkg}")`)
                .children().removeClass('d-none');
            // Switch to claimed
            swapStatus(id, tileStatus, 'claimed');
            break;
        case 'claimed':
            // Switch to stolen
            swapStatus(id, tileStatus, 'stolen');    
            break;
        case 'stolen':
            // Switch to locked
            swapStatus(id, tileStatus, 'locked');    
            break;
        default:
            alert('This prize is locked!');
            break;
    }
    
});

// This function will remove a class and add another
const swapStatus = (id, current, next) => {
    $(`#${id}`).addClass(next)
        .removeClass(current);
}