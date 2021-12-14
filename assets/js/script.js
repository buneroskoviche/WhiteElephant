const $gameBoard = $("#game-board");
const $randomizer = $("#randomizer");
const $randomizerBtn = $("#randomizer-btn");
const $skipBtn = $("#skip-btn");
const $chooseBtn = $("#choose-btn");
const $playerTxt = $("#player-text");
const $playerList = $("#player-list");

const names = config.names;
const intGifts = config.gifts;
const packages = config.packages;

let currentPlayer = "";

// Quadruple the gifts array
const gifts = [];
for (let i = 0; i < 4; i++) {
    gifts.push(...intGifts);
}

// Append tiles for each player
for (let i = 0; i < names.length; i++) {
    // Extract a random gift from the array
    const randomGift = gifts.splice(Math.floor(Math.random() * gifts.length), 1);
    // Add a tile to the board with that gift
    appendTile(randomGift[0], i + 1);
}

// Functions for the start button and skip button are the same
$randomizerBtn.on("click", newPlayer);
$skipBtn.on("click", newPlayer);

// Function for the "Choose Another Player" button
// will add the current player back to the list first
$chooseBtn.on("click", function() {
    // Add the current player back to the list
    names.push(currentPlayer);
    // Choose another player
    newPlayer();
});

// Function for the game board
$gameBoard.on("click", function(event) {
    // If no player is selected, alert
    if(!currentPlayer) {
        if(names.length === 0) {
            alert('No players left.');
            return;
        }
        alert('Choose a player first!');
        return;
    }

    const element = event.target;
    const classes = element.classList
    const tileStatus = classes[classes.length - 1];
    const id = element.getAttribute('id');

    // Determine the next action based on the status of the tile clicked
    switch(tileStatus) {
        case 'unclaimed':
            // Unhide hidden elements
            const bkg = element.getAttribute('data-bkg');
            $(`#${id}`).css('background-image', `url("${bkg}")`)
                .children().removeClass('d-none');
            // Hide the ID number
            $(`#${id}`).children('h1').addClass('d-none');
            // Adjust flex settings
            swapStatus(id, 'justify-content-center align-items-center', 'flex-column-reverse');
            // Switch to claimed
            swapStatus(id, tileStatus, 'claimed');
            // Set the new owner
            setOwner(id);
            // Reset the current player
            setCurrentPlayer();
            break;
        case 'claimed':
            // Switch to stolen
            swapStatus(id, tileStatus, 'stolen');    
            // Switch the active player to the old owner
            handleSteal(id);
            break;
        case 'stolen':
            // Switch to locked
            swapStatus(id, tileStatus, 'locked');
            // Switch the active player to the old owner
            handleSteal(id);
            break;
        case 'locked':
            alert('This prize is locked!');
            break;
        default:
            break;
    }

    // Hide the option buttons
    $skipBtn.addClass('d-none');
    $chooseBtn.addClass('d-none');
    
});

// This function will remove a class and add another
function swapStatus(id, current, next) {
    $(`#${id}`).addClass(next)
        .removeClass(current);
}

// Generate a tile and add it the game board
function appendTile(object, number) {
    // Select a random package
    const hider = packages[Math.floor(Math.random() * packages.length)];
    // Create the tile
    const $tile = $("<div>")
        .addClass("d-flex justify-content-center align-items-center border border-light rounded tile unclaimed")
        .css('background-image', `url(./assets/Images/packages/${hider})`)
        .attr('data-bkg', `./assets/Images/gifts/${object.image}`)
        .attr('id', number);
    // Create the tag for the ID number
    const $idTag = $("<h1>").text(number).addClass('tileNum');
    // Create the owner tag
    const owner = $("<p>").addClass('d-flex justify-content-center owner');
    // Create the owner span
    const ownerSpan = $("<span>").addClass('owner-text')
    // Put the owner span in the owner tag
    owner.append(ownerSpan);
    // Put the owner tag in the tile
    $tile.append($idTag).append(owner).children('p').addClass('d-none');
    // Add the tile to the list
    $gameBoard.append($tile);
}



// This function chooses the next player randomly
function randomizePlayer() {
    // If there are no more names left, exit
    if(names.length < 1) {
        return "That's all folks!";
    }
    // Generate a random number
    const num = Math.floor(Math.random() * names.length);
    // Splice the corresponding index in the names array
    const nextPlayer = names.splice(num, 1);
    // Return the player name
    return nextPlayer[0];
}

// This function will set the current player
function setCurrentPlayer(player) {
    // If no player is specified
    if(!player) {
        // Reset everything
        currentPlayer = "";
        $playerTxt.text('Select the next player!');
        $randomizerBtn.removeClass('d-none');
        return;
    }
    currentPlayer = player;
    $playerTxt.text(player);
    $randomizerBtn.addClass('d-none');
}

// This function will swap a prize's owner
function setOwner(tileId) {
    // Get the owner span
    $tileOwnerSpan = $(`#${tileId}`).children().children('span');
    // Get the current value
    oldOwner = $tileOwnerSpan.text();
    // Set the new owner
    $tileOwnerSpan.text(currentPlayer);
    // Return the old owner
    return oldOwner;
}

// This function will handle when a player steals a prize
function handleSteal(tileId) {
    // Switch the owner and return the old owner
    const stolenPlayer = setOwner(tileId);
    // Set the old owner to the active player
    setCurrentPlayer(stolenPlayer);
}

// This function will choose another player and remove them from the list
function newPlayer() {
    if(names.length !== 0) {
        // Choose a random name
        const next = randomizePlayer();
        // Set the current player
        setCurrentPlayer(next);
        // Unhide the other buttons
        $chooseBtn.removeClass('d-none');
        $skipBtn.removeClass('d-none');
        return;
    }
    $playerTxt.text("That's all folks!");
    $randomizerBtn.addClass('d-none');
    return;
}