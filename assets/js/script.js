const $gameBoard = $("#game-board");
const $randomizer = $("#randomizer");
const $randomizerBtn = $("#randomizer-btn");
const $skipBtn = $("#skip-btn");
const $chooseBtn = $("#choose-btn");
const $playerTxt = $("#player-text");
const $results = $("#results");
const $resultsBtn = $("#results-btn");

const names = config.names;
const packages = config.packages;

let currentPlayer = "";
let lastStolen = ";";

// Set up an array that will hold local storage data
const storage = [];

// If local storage data exists...
const local = localStorage.getItem('white-elephant')
if(local) {
    // Load it and add it to the storage array
    storage.push(...JSON.parse(local));
    // Remove any players that have already claimed gifts
    for (let i = 0; i < storage.length; i++) {
        for (let j = 0; j < names.length; j++) {
            if (storage[i].owner === names[j]) {
                names.splice(j, 1);
                break;
            }
        }
    }
    // Load tiles onto the board
    for (let i = 0; i < storage.length; i++) {
        const { id, image, classes, owner } = storage[i];
        appendTile(image, id, classes);
        // Reveal if the gift is claimed
        if(!classes.includes('unclaimed')){
            reavealTile(id, image);
            setOwner(id, owner);
            addResult(owner, image);
        }
    }
} else {
    // Quadruple the gifts array
    const intGifts = config.gifts;
    const gifts = [];
    for (let i = 0; i < 4; i++) {
        gifts.push(...intGifts);
    }
    // Append random tiles based on the number of players
    for (let i = 0; i < names.length; i++) {
        // Extract a random gift from the array
        const randomGift = gifts.splice(Math.floor(Math.random() * gifts.length), 1);
        // Add a tile to the board with that gift
        const defaultClasses = "d-flex justify-content-center align-items-center border border-light rounded tile unclaimed"
        const save = appendTile(randomGift[0].image, i + 1, defaultClasses);
        // Add the tile data to the storage array
        storage.push(save);
    }
    // Save the default storage array
    localStorage.setItem('white-elephant', JSON.stringify(storage));
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

// Results buttons will show the results list
$resultsBtn.on("click", function() {
    $results.toggleClass('d-none');
    $gameBoard.toggleClass('d-none');
})

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

    const tile = event.target;
    const classes = tile.classList
    const tileStatus = classes[classes.length - 1];
    const id = tile.getAttribute('id');
    const bkg = tile.getAttribute('data-bkg');

    // Create an object to save to local storage
    const toSave = {
        id: Number(id),
        owner: currentPlayer,
        image: bkg,
        classes: tile.className
    }

    // Check if the tile was just stolen
    if(id === lastStolen) {
        alert('No steal-backs!')
        return;
    }

    // Determine the next action based on the status of the tile clicked
    switch(tileStatus) {
        case 'unclaimed':
            reavealTile(id, bkg);
            // Switch to claimed
            swapStatus(id, tileStatus, 'claimed');
            // Set the new owner
            setOwner(id, currentPlayer);
            // Add result to the list
            addResult(currentPlayer, bkg);
            // Update the save object with new classes
            toSave.classes = tile.className;
            // Save to storage
            updateStorage(toSave);
            // Reset the current player
            setCurrentPlayer();
            break;
        case 'claimed':
            // Switch to stolen
            swapStatus(id, tileStatus, 'stolen');
            // Add result to the list
            addResult(currentPlayer, bkg);
            // Update the save object with new classes
            toSave.classes = tile.className;
            // Save to storage
            updateStorage(toSave); 
            // Switch the active player to the old owner
            handleSteal(id);
            break;
        case 'stolen':
            // Switch to locked
            swapStatus(id, tileStatus, 'locked');
            // Add result to the list
            addResult(currentPlayer, bkg);
            // Update the save object with new classes
            toSave.classes = tile.className;
            // Save to storage
            updateStorage(toSave);
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
function appendTile(imgString, number, classString) {
    // Select a random package
    const hider = packages[Math.floor(Math.random() * packages.length)];
    // Create the tile
    const $tile = $("<div>")
        .addClass(classString)
        .css('background-image', `url(./assets/Images/packages/${hider})`)
        .attr('data-bkg', imgString)
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
    // Return a default object to save to storage
    return {
        id: number,
        owner: '',
        classes: classString,
        image: imgString,
    }
}

// This function will add a player and their prize to the results list
function addResult(player, prize) {
    console.log(player, prize)
    // Make a list item
    const newResult = $("<li>").attr('id', player.replace(' ', '-')).text(`${player}: ${prize.replace('.png', '')}`);
    // Append it to the list
    $results.append(newResult);
    return;
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
        lastStolen = ';'
        return;
    }
    currentPlayer = player;
    $playerTxt.text(player);
    $randomizerBtn.addClass('d-none');
    return;
}

// This function will swap a prize's owner
function setOwner(tileId, name) {
    // Get the owner span
    $tileOwnerSpan = $(`#${tileId}`).children().children('span');
    // Get the current value
    oldOwner = $tileOwnerSpan.text();
    // Set the new owner
    $tileOwnerSpan.text(name);
    // Return the old owner
    return oldOwner;
}

// This function will handle when a player steals a prize
function handleSteal(tileId) {
    // Switch the owner and return the old owner
    const stolenPlayer = setOwner(tileId, currentPlayer);
    // Save the ID of the stolen tile
    lastStolen = tileId;
    // Remove the old result listed
    $(`#${stolenPlayer.replace(' ', '-')}`).remove();
    // Set the old owner to the active player
    setCurrentPlayer(stolenPlayer);
    return;
}

// This function will choose another player and remove them from the list
function newPlayer() {
    if(names.length >= 1) {
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
    $chooseBtn.addClass('d-none');
    $skipBtn.addClass('d-none');
    $resultsBtn.removeClass('d-none');
    return;
}

// This function will save the state of the game to local storage
function updateStorage(object) {
    console.log(storage)
    // Splice in the new object data if the tile IDs match
    for (let i = 0; i < storage.length; i++) {
        if(object.id === storage[i].id) {
            storage.splice(i, 1, object);
        }
    }
    console.log(storage)
    // Save the array to local
    localStorage.setItem('white-elephant', JSON.stringify(storage));
}

function reavealTile(id, bkg) {
    // Unhide hidden elements
    $(`#${id}`).css('background-image', `url("./assets/Images/gifts/${bkg}")`)
    .children().removeClass('d-none');
    // Hide the ID number
    $(`#${id}`).children('h1').addClass('d-none');
    // Adjust flex settings
    swapStatus(id, 'justify-content-center align-items-center', 'flex-column-reverse');
}