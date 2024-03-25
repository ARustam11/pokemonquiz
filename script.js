// DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");


// Main Variables

let usedPokemonIds = [];
let count = 0;
let points = 0;
// let wrongAnswers = 0;
let showLoading = false;

// Async Function to fetch one Pokemon with an ID 

async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}


// Function to load question with options

async function loadQuestionWithOptions() {
    //make image white again
    // pokemonImageElement.classList.remove("appear");

    if (showLoading) {
        hidePuzzleWindow();
        showLoadingWindow();
    }
    

    let pokemonId = getRandomPokemonId();

    // Check if the current question has been used
    while (usedPokemonIds.includes(pokemonId)) {
        pokemonId = getRandomPokemonId();
    }

    //  
    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);

    //Options array
    const options = [pokemon.name];
    const optionsIds = [pokemon.id];

    //Fetch additional random Pokemon names to use as options

    while (options.length < 4) {
        let randomPokemonId = getRandomPokemonId();

        //Ensure fetched option does not exist in the options list. Creates a new random id until it does not exist in optionsIds
        while (optionsIds.includes(randomPokemonId)) {
            randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);

        // Fetching a random pokemon with the newly made id and adding it to options array

        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);
        
        // Turn of loading if all options have been fetched
        if (options.length === 4) {
            showLoading = false;
        }

    }
    shuffleArray(options);

    // Clear any previous result and update pokemon Image
    resultElement.textContent = "Who's that Pokemon?";
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

    // Create options HTML elements from options array in the DOM.

    optionsContainer.innerHTML = "";
    options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.name, event);
        optionsContainer.appendChild(button);
    });

    // ENDGAME
    // if (points === 10 || wrongAnswers === 5) {
    //     endGame();
    //     return;
    // }
    //

    if (!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
    }

}

//Creating checkAnswer function

function checkAnswer(isCorrect, event) {
    // Checks if any button is already selected, if false then no element and returns null
    const selectedButton = document.querySelector(".selected");

    if (selectedButton) {
        return;
    }   

    //Else mark the clicked button as selected and increase the count by 1
    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;
    

    if (isCorrect) {
        //call display function
        displayResult("Correct answer!");
        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct");
        // pokemonImageElement.classList.add("appear"); //makes image colored
        // if (points === 10) {
        //     endGame();
        // }
    } else {
        displayResult("Wrong answer... ");
        event.target.classList.add("wrong");
        // pokemonImageElement.classList.add("appear"); // makes image colored
        // wrongAnswers++;
        // if (wrongAnswers === 5) {
        //     endGame();
        // }
    }

    // Load the next question with a 1s delay for user to read the result.

    setTimeout(() => {
        showLoading = true;
        loadQuestionWithOptions();
    }, 1000)

}
    

//ENDGAME
// function endGame() {
//     if (points === 10) {
//         displayResult("Congratulations! You reached 10 points.");
//     } else {
//         displayResult("Game over. You made 5 wrong answers.");
//     }
// }   


loadQuestionWithOptions();


// --- UTILITY FUNCTIONS ---
 


//Function to randomize the pokemon ID

function getRandomPokemonId(){
    return Math.floor(Math.random() * 151 + 1);
}

// Shifle the array we send it

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Function to update the result text and class name

function displayResult(result) {
    resultElement.textContent = result;
}

// Hide loading function
function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
}

// Show loading function

function showLoadingWindow() {
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

// Show puzzle

function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

// Hide puzzle window

function hidePuzzleWindow() {
    mainContainer[0].classList.add("hide");
}

