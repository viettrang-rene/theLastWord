document.addEventListener('DOMContentLoaded', function() {
    const wordImage = document.getElementById('word-image');
    const wordDisplay = document.getElementById('word-display');
    const letterTilesContainer = document.getElementById('letter-tiles');
    const feedbackElement = document.getElementById('feedback');
    const clearButton = document.getElementById('clear-button');
    const newWordButton = document.getElementById('new-word-button');

    const words = [
        { word: "DOG", image: "images/dog.jpg" },
        { word: "CAT", image: "images/cat.jpg" },
        { word: "BIRD", image: "images/bird.jpg" },
        { word: "FISH", image: "images/fish.jpg" },
        { word: "COW", image: "images/cow.jpg" },
        { word: "SHEEP", image: "images/sheep.jpg" },
        { word: "DUCK", image: "images/duck.jpg" },
        { word: "HORSE", image: "images/horse.jpg" },
        { word: "PIG", image: "images/pig.jpg" }, // Assuming you might have a pig.jpg
        { word: "FROG", image: "images/frog.jpg" }
    ];

    let currentWord = '';
    let currentImage = '';
    let spelledWord = '';
    let availableTiles = []; // To keep track of which tiles are still clickable

    // Function to get a random character (for distracting letters)
    function getRandomCharacter() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // Function to start a new game
    function newGame() {
        // Clear previous state
        spelledWord = '';
        wordDisplay.textContent = '';
        letterTilesContainer.innerHTML = '';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback'; // Reset feedback styles
        availableTiles = [];

        // Select a random word
        const randomIndex = Math.floor(Math.random() * words.length);
        const selectedItem = words[randomIndex];
        currentWord = selectedItem.word;
        currentImage = selectedItem.image;

        // Set the image source
        wordImage.src = currentImage;
        wordImage.alt = `Image of a ${currentWord.toLowerCase()}`;

        // Generate letter tiles
        const correctLetters = currentWord.split('');
        const allTiles = [...correctLetters]; // Start with correct letters

        // Add some distracting letters (e.g., 3-5 random letters)
        const numDistractingLetters = Math.floor(Math.random() * 3) + 3; // 3 to 5
        for (let i = 0; i < numDistractingLetters; i++) {
            allTiles.push(getRandomCharacter());
        }

        // Shuffle all tiles
        shuffleArray(allTiles);

        // Create tile elements
        allTiles.forEach((letter, index) => {
            const tile = document.createElement('div');
            tile.classList.add('letter-tile');
            tile.textContent = letter;
            tile.dataset.index = index; // Store original index for uniqueness if needed, or just for tracking
            tile.addEventListener('click', handleTileClick);
            letterTilesContainer.appendChild(tile);
            availableTiles.push(tile); // Add to tracking
        });

        // Initialize word display with underscores
        wordDisplay.textContent = '_ '.repeat(currentWord.length).trim();
    }

    // Handle click on a letter tile
    function handleTileClick(event) {
        const clickedTile = event.target;
        const letter = clickedTile.textContent;

        // Check if the clicked letter matches the next letter in the current word
        const nextCorrectLetter = currentWord[spelledWord.length];

        if (letter === nextCorrectLetter) {
            spelledWord += letter;
            updateWordDisplay();
            clickedTile.classList.add('clicked'); // Mark as clicked and disable
            clickedTile.classList.add('correct-feedback'); // Provide visual feedback
            
            // Remove from available tiles to prevent re-use if not already prevented by 'clicked' class
            // (The 'pointer-events: none' in CSS for 'clicked' class handles this directly)

            if (spelledWord === currentWord) {
                feedbackElement.textContent = "Great job! You spelled it!";
                feedbackElement.classList.add('correct-feedback');
                disableAllTiles();
            } else {
                feedbackElement.textContent = "Correct letter!";
                feedbackElement.classList.remove('incorrect-feedback'); // Clear any previous incorrect feedback
                feedbackElement.classList.add('correct-feedback');
            }
            setTimeout(() => feedbackElement.classList.remove('correct-feedback'), 500); // Clear feedback
        } else {
            feedbackElement.textContent = `Oops! Try again. Expected '${nextCorrectLetter}'`;
            feedbackElement.classList.add('incorrect-feedback');
            clickedTile.classList.add('incorrect-feedback'); // Provide visual feedback on the tile
            setTimeout(() => clickedTile.classList.remove('incorrect-feedback'), 500); // Clear tile feedback
        }
    }

    // Update the displayed word (e.g., _ _ G -> D O G)
    function updateWordDisplay() {
        let display = currentWord.split('').map((char, index) => {
            return index < spelledWord.length ? spelledWord[index] : '_';
        }).join(' ');
        wordDisplay.textContent = display;
    }

    // Disable all tiles after word completion
    function disableAllTiles() {
        document.querySelectorAll('.letter-tile').forEach(tile => {
            tile.classList.add('clicked');
        });
    }

    // Event listeners for control buttons
    clearButton.addEventListener('click', function() {
        spelledWord = '';
        updateWordDisplay();
        document.querySelectorAll('.letter-tile').forEach(tile => {
            tile.classList.remove('clicked', 'correct-feedback', 'incorrect-feedback');
            // Re-enable pointer events if they were turned off by JS
            tile.style.pointerEvents = 'auto'; 
        });
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
    });

    newWordButton.addEventListener('click', newGame);

    // Initial game setup when the page loads
    newGame();
});
