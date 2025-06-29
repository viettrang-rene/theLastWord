document.addEventListener('DOMContentLoaded', function() {
    const maxWords = 30; // Increased from 10 to 20
    let gridSize = 15; // Grid size remains 15 by default, user might have changed it to 18 in their local file.
    let grid = [];
    let wordPositions = {};
    let foundWords = new Set();
    let activeWords = [];

    // Thematic Vocabulary Data
    const THEMES_DATA = {
        "Animals": {
            "starters": [
                "animal", "hippo", "bear", "horse", "bee", "jellyfish", "bird", "lizard", "cat", "monkey",
                "chicken", "mouse", "mice", "cow", "pet", "crocodile", "polarbear", "dog", "sheep", "donkey",
                "snake", "duck", "spider", "elephant", "tail", "fish", "tiger", "frog", "zebra", "giraffe",
                "goat", "zoo"
            ],
            "movers": [
                "bat", "cage", "dolphin", "fly", "kangaroo", "kitten", "lion", "panda", "parrot", "penguin",
                "puppy", "rabbit", "shark", "snail", "whale"
            ],
            "flyers": [
                "beetle", "butterfly", "camel", "creature", "dinosaur", "eagle", "extinct", "fur", "insect", "nest",
                "octopus", "swan", "tortoise", "wild", "wing"
            ]
        },
        "TheBody": {
            "starters": [
                "arm", "body", "hand", "head", "face", "ear", "leg", "eye", "mouth", "nose", "fair", "foot",
                "feet", "smile", "hair"
            ],
            "movers": [
                "back", "beard", "neck", "shoulder", "blonde", "stomach", "knee", "curly", "thin", "tooth",
                "teeth", "fat", "moustache"
            ],
            "flyers": [
                "elbow", "finger", "toe"
            ]
        },
        "Clothes": {
            "starters": [
                "bag", "shoe", "baseballcap", "shorts", "boots", "skirt", "clothes", "sock", "dress", "trousers",
                "glasses", "tshirt", "handbag", "wear", "hat", "jacket", "jeans", "shirt"
            ],
            "movers": [
                "coat", "helmet", "scarf", "sweater", "swimsuit"
            ],
            "flyers": [
                "belt", "ring", "bracelet", "spot", "spotted", "costume", "crown", "stripe", "striped", "glove",
                "necklace", "pajamas", "pyjamas", "pocket", "trainers", "umbrella"
            ]
        },
        "Colours": {
            "starters": [
                "black", "orange", "blue", "pink", "brown", "purple", "colour", "color", "red", "gray", "grey",
                "white", "green", "yellow"
            ],
            "movers": [], // No specific movers words listed
            "flyers": [
                "gold", "silver", "spot", "spotted", "stripe", "striped"
            ]
        },
        "FamilyAndFriends": {
            "starters": [
                "baby", "boy", "grandmother", "grandpa", "brother", "kid", "child", "children", "live", "classmate",
                "man", "men", "cousin", "mother", "dad", "mum", "family", "old", "father", "person", "people",
                "friend", "sister", "girl", "woman", "women", "grandfather", "grandma", "young"
            ],
            "movers": [
                "aunt", "daughter", "granddaughter", "grandparent", "grandson", "grownup", "parent", "son", "uncle"
            ],
            "flyers": [
                "husband", "married", "surname", "wife"
            ]
        },
        "FoodAndDrink": {
            "starters": [
                "apple", "juice", "banana", "kiwi", "bean", "lemon", "bread", "lemonade", "breakfast", "lime",
                "burger", "mango", "cake", "meat", "candy", "sweets", "carrot", "meatballs", "chicken", "milk",
                "chips", "fries", "onion", "chocolate", "orange", "coconut", "pea", "dinner", "pear", "drink",
                "pineapple", "eat", "potato", "egg", "rice", "fish", "sausage", "food", "sweet", "tomato", "fruit",
                "water", "grape", "watermelon", "icecream"
            ],
            "movers": [
                "bottle", "bowl", "cheese", "coffee", "cup", "glass", "hungry", "milkshake", "noodles", "pancake",
                "pasta", "picnic", "plate", "salad", "sandwich", "sauce", "soup", "tea", "thirsty", "vegetable"
            ],
            "flyers": [
                "biscuit", "cookie", "butter", "cereal", "chopsticks", "flour", "fork", "honey", "jam", "knife",
                "meal", "olives", "pepper", "piece", "pizza", "salt", "smell", "snack", "spoon", "strawberry",
                "sugar", "taste", "yoghurt"
            ]
        },
        "Health": {
            "starters": [], // No specific starters words listed
            "movers": [
                "cold", "cough", "cry", "dentist", "doctor", "earache", "fall", "fine", "headache", "hospital",
                "ill", "matter", "nurse", "sick", "stomachache", "temperature", "tired", "toothache"
            ],
            "flyers": [
                "bandage", "chemist", "cut", "fallover", "medicine", "xray"
            ]
        },
        "TheHome": {
            "starters": [
                "apartment", "flat", "house", "kitchen", "armchair", "lamp", "bath", "livingroom", "bathroom", "mat",
                "bed", "mirror", "bedroom", "phone", "bookcase", "picture", "box", "camera", "radio", "room",
                "chair", "rug", "clock", "sleep", "computer", "sofa", "cupboard", "table", "desk", "television",
                "tv", "diningroom", "toy", "doll", "tree", "door", "wall", "flower", "watch", "garden", "hall",
                "home", "window", "wash"
            ],
            "movers": [
                "address", "balcony", "basement", "blanket", "downstairs", "dream", "elevator", "lift", "floor",
                "internet", "message", "roof", "seat", "shower", "stairs", "stair", "toothbrush", "toothpaste",
                "towel", "upstairs"
            ],
            "flyers": [
                "brush", "comb", "cooker", "cushion", "diary", "entrance", "envelope", "fridge", "gate", "key",
                "letter", "mail", "oven", "screen", "shampoo", "shelf", "soap", "stamp", "step", "swing", "telephone"
            ]
        },
        "Materials": {
            "starters": ["paper"],
            "movers": ["card", "glass", "gold", "metal"],
            "flyers": ["plastic", "silver", "wood", "wool"]
        },
        "Names": {
            "starters": [
                "alex", "alice", "ann", "anna", "ben", "bill", "dan", "eva", "grace", "hugo", "jill", "kim",
                "lucy", "mark", "matt", "may", "nick", "pat", "sam", "sue", "tom"
            ],
            "movers": [
                "charlie", "clare", "daisy", "fred", "jack", "jane", "jim", "julia", "lily", "mary", "paul"
            ],
            "flyers": [
                "betty", "richard", "david", "robert", "emma", "sarah", "frank", "sophia", "george", "william",
                "harry", "helen", "holly", "katy", "michael", "oliver"
            ]
        },
        "Numbers": {
            "starters": [
                "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
                "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
            ],
            "movers": (function() {
                let nums = [];
                for (let i = 21; i <= 99; i++) {
                    let word = '';
                    if (i < 20) word = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"][i - 1];
                    else {
                        const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
                        const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
                        word = tens[Math.floor(i / 10)] + units[i % 10];
                    }
                    nums.push(word);
                }
                nums.push("onehundred", "hundred");
                const ordinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];
                nums.push(...ordinals);
                nums.push("pair");
                return nums;
            })(),
            "flyers": (function() {
                let nums = ["onehundredone", "twohundred", "onethousand", "thousand", "million", "several"];
                const ordinalsTens = ["", "", "twenty", "thirty"];
                const ordinalsUnits = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
                for (let i = 21; i <= 31; i++) {
                    let word = '';
                    if (i === 20) word = "twentieth";
                    else if (i === 30) word = "thirtieth";
                    else if (i === 31) word = "thirtyfirst";
                    else word = ordinalsTens[Math.floor(i / 10)] + ordinalsUnits[i % 10];
                    nums.push(word);
                }
                return nums;
            })()
        },
        "PlacesAndDirections": {
            "starters": [
                "behind", "between", "bookshop", "end", "here", "in", "infrontof", "on", "park", "playground",
                "shop", "store", "there", "under", "zoo", "street"
            ],
            "movers": [
                "above", "below", "building", "busstation", "busstop", "cafe", "carpark", "centre", "center",
                "cinema", "circus", "city", "town", "towncentre", "farm", "funfair", "hospital", "library", "map",
                "market", "middle", "near", "opposite", "place", "shoppingcentre", "sportscentre", "square",
                "station", "straight", "supermarket", "swimmingpool"
            ],
            "flyers": [
                "airport", "museum", "bank", "north", "bridge", "over", "castle", "path", "chemist", "club",
                "policestation", "postoffice", "college", "restaurant", "corner", "right", "east", "factory",
                "firestation", "skyscraper", "south", "front", "hotel", "kilometre", "kilometer", "straighton",
                "theatre", "theater", "left", "university", "way", "london", "west"
            ]
        },
        "School": {
            "starters": [
                "alphabet", "mouse", "answer", "ask", "board", "book", "bookcase", "open", "page", "class",
                "painting", "classroom", "paper", "close", "part", "colour", "color", "pen", "computer", "pencil",
                "correct", "picture", "crayon", "playground", "cross", "poster", "cupboard", "question", "desk",
                "read", "door", "right", "draw", "rubber", "eraser", "english", "ruler", "example", "school",
                "find", "sentence", "floor", "sit", "keyboard", "spell", "learn", "stand", "lesson", "story",
                "letter", "tell", "line", "tick", "listen", "understand", "look", "wall", "window", "word", "write"
            ],
            "movers": [
                "break", "art", "homework", "mistake", "teach", "text", "website"
            ],
            "flyers": [
                "backpack", "rucksack", "bin", "club", "college", "competition", "dictionary", "flag", "geography",
                "glue", "group", "gym", "history", "language", "maths", "math", "online", "project", "science",
                "scissors", "screen", "shelf", "student", "study", "subject", "timetable", "university"
            ]
        },
        "SportsAndLeisure": {
            "starters": [
                "badminton", "ball", "listen", "music", "baseball", "photo", "basketball", "piano", "bat", "picture",
                "beach", "play", "bike", "radio", "boat", "read", "book", "ride", "bounce", "run", "camera", "sing",
                "catch", "skateboard", "doll", "skateboarding", "soccer", "football", "drawing", "song", "drive",
                "sport", "enjoy", "favourite", "favorite", "story", "swim", "fishing", "fly", "tabletennis",
                "takeaphoto", "takeapicture", "game", "television", "tv", "guitar", "tennis", "hobby", "tennisracket",
                "hockey", "throw", "jump", "toy", "kick", "walk", "kite", "watch", "score"
            ],
            "movers": [
                "band", "cd", "cinema", "comic", "comicbook", "dance", "drive", "dvd", "email", "film", "movie",
                "fish", "goshopping", "goal", "holiday", "hop", "iceskates", "iceskating", "kick", "net", "party",
                "player", "pool", "practice", "practise", "present", "ride", "rollerskating", "rollerskates", "sail"
            ],
            "flyers": [
                "skate", "skip", "backpack", "rucksack", "cartoon", "score", "channel", "ski", "chess", "sledge",
                "collect", "snowball", "concert", "snowboard", "diary", "snowboarding", "drum", "snowman", "festival",
                "stage", "flashlight", "suitcase", "swing", "golf", "hotel", "team", "instrument", "tent",
                "invitation", "torch", "join", "tune", "magazine", "tyre", "tire", "match", "umbrella", "meet",
                "member", "online", "violin", "volleyball", "popmusic", "winner", "prize", "programme", "program",
                "puzzle", "pyramid", "quiz", "race", "rockmusic"
            ]
        },
        "Time": {
            "starters": [
                "afternoon", "birthday", "clock", "day", "evening", "in", "morning", "night", "today", "watch",
                "year", "after", "always", "before", "every", "never", "oclock", "sometimes", "week", "weekend",
                "yesterday"
            ],
            "movers": [
                "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
            ],
            "flyers": [
                "am", "quarter", "spring", "summer", "ago", "autumn", "fall", "calendar", "century", "date",
                "early", "end", "future", "hour", "howlong", "late", "later", "midday", "midnight", "minute",
                "month", "pm", "past", "november", "december", "january", "february", "march", "april", "may",
                "june", "july", "august", "september", "october"
            ]
        },
        "Toys": {
            "starters": [
                "alien", "ball", "helicopter", "lorry", "truck", "balloon", "monster", "baseball", "motorbike",
                "basketball", "plane", "bike", "robot", "boardgame", "boat", "soccer", "football", "car", "teddy",
                "doll", "toy", "train", "game"
            ],
            "movers": ["model"],
            "flyers": [] // No specific flyers words listed
        },
        "Transport": {
            "starters": [
                "bike", "boat", "plane", "ride", "bus", "run", "car", "ship", "drive", "swim", "fly", "train",
                "go", "helicopter", "truck", "lorry"
            ],
            "movers": [
                "busstation", "busstop", "driver", "ride", "station", "ticket", "tractor", "trip", "platform", "wheel"
            ],
            "flyers": [
                "ambulance", "bicycle", "racing", "railway", "rocket", "fireengine", "firetruck", "journey",
                "spaceship", "lift", "taxi", "motorway", "passenger", "tour", "traffic"
            ]
        },
        "Weather": {
            "starters": ["sun"],
            "movers": [
                "cloud", "cloudy", "snow", "sunny", "fog", "foggy", "ice", "weather", "storm", "rain", "wind",
                "rainbow", "sky", "windy"
            ],
            "flyers": [] // No specific flyers words listed
        },
        "Work": {
            "starters": [
                "teacher", "circus", "clown", "cook", "dentist", "doctor", "driver", "farmer", "film", "movie",
                "star", "hospital", "nurse", "pirate", "popstar", "work"
            ],
            "movers": [
                "actor", "airport", "ambulance", "artist", "astronaut", "business", "businessman", "businesswoman",
                "designer", "engineer", "factory", "fireengine", "firetruck", "firefighter", "job", "journalist"
            ],
            "flyers": [
                "manager", "mechanic", "meeting", "news", "newspaper", "office", "photographer", "pilot",
                "policeofficer", "policestation", "queen", "rocket", "singer", "taxi", "waiter"
            ]
        },
        "TheWorldAroundUs": {
            "starters": [
                "beach", "sand", "sea", "shell", "street", "sun", "tree", "water"
            ],
            "movers": [
                "building", "city", "country", "countryside", "field", "forest", "grass", "ground", "island", "lake",
                "leaf", "leaves", "moon", "river", "road", "rock", "sky", "star", "town", "village", "waterfall",
                "wave", "world"
            ],
            "flyers": [
                "mountain", "plant", "air", "bridge", "land", "ocean", "castle", "planet", "cave", "pond", "desert",
                "space", "earth", "stone", "entrance", "stream", "environment", "view", "exit", "wood", "fire",
                "future", "hill"
            ]
        }
    };

    // DOM elements
    const themeSelect = document.getElementById('theme-select');
    const wordInputs = document.querySelectorAll('.word-inputs input');
    const generateBtn = document.getElementById('generate-btn');
    const statsDiv = document.querySelector('.stats');
    const wordListDiv = document.querySelector('.word-list');
    const clearWordsBtn = document.getElementById('clear-words-btn');
    const printButton = document.getElementById('print-wordsearch-btn'); // New: Print button element

    // Populate theme dropdown
    for (const category in THEMES_DATA) {
        for (const level in THEMES_DATA[category]) {
            // Only add options if there are words for that level
            if (THEMES_DATA[category][level].length > 0) {
                const option = document.createElement('option');
                // Format category names for display
                const displayCategory = category.replace(/([A-Z])/g, ' $1').trim().replace(/And/g, '&');
                const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);
                
                option.value = `${category}-${level}`;
                option.textContent = `${displayCategory} - ${displayLevel}`;
                themeSelect.appendChild(option);
            }
        }
    }

    // Event listener for theme selection
    themeSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        clearWordInputs(); // Clear manual inputs first
        if (selectedValue) {
            const [categoryKey, levelKey] = selectedValue.split('-');
            const wordsToLoad = THEMES_DATA[categoryKey][levelKey];
            
            // Populate word inputs, max 20 words (or fewer if theme has less)
            wordInputs.forEach((input, index) => {
                if (wordsToLoad && wordsToLoad[index]) {
                    input.value = wordsToLoad[index];
                } else {
                    input.value = '';
                }
            });
        }
    });

    // Event listener for clearing words
    clearWordsBtn.addEventListener('click', clearWordInputs);

    function clearWordInputs() {
        wordInputs.forEach(input => input.value = '');
    }
    
    // Original generate button logic
    generateBtn.addEventListener('click', function() {
        activeWords = [];
        wordInputs.forEach(input => {
            const word = input.value.trim().toUpperCase();
            if (word.length >= 3 && word.length <= 12) { // Validate length for word search
                activeWords.push(word);
            }
        });
        
        if (activeWords.length > 0) {
            generateWordSearch();
            statsDiv.style.display = 'block';
            wordListDiv.style.display = 'block';
            document.getElementById('total-words').textContent = activeWords.length;
        } else {
            alert('Please select a theme or enter at least one valid word (3-12 letters).');
        }
    });

    // New: Event listener for print button
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    function initializeGrid() {
        grid = [];
        wordPositions = {};
        foundWords.clear();
        updateFoundCount();
        document.getElementById('congrats-message').style.display = 'none';
        
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = '';
            }
        }
        
        const wordsList = document.getElementById('words-to-find');
        wordsList.innerHTML = '';
        activeWords.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.dataset.word = word;
            wordsList.appendChild(li);
        });
        
        const cells = document.querySelectorAll('#wordSearch td');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }
    
    function updateFoundCount() {
        const foundCount = foundWords.size;
        const totalWords = activeWords.length;
        document.getElementById('found-count').textContent = foundCount;
        document.getElementById('total-words').textContent = totalWords;
        
        if (foundCount === totalWords && totalWords > 0) {
            document.getElementById('congrats-message').style.display = 'block';
        } else {
            document.getElementById('congrats-message').style.display = 'none';
        }
    }
    
    const directions = [
        [1, 0], [0, 1], [1, 1], [-1, 1],
        [-1, 0], [0, -1], [-1, -1], [1, -1]
    ];
    
    function canPlaceWord(word, row, col, direction) {
        const [rowDir, colDir] = direction;
        const endRow = row + (word.length - 1) * rowDir;
        const endCol = col + (word.length - 1) * colDir;
        
        if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) {
            return false;
        }
        
        for (let i = 0; i < word.length; i++) {
            const r = row + i * rowDir;
            const c = col + i * colDir;
            
            if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    function placeWord(word) {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            attempts++;
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [rowDir, colDir] = direction;
            
            let row, col;
            
            if (rowDir === 1) { // Down
                row = Math.floor(Math.random() * (gridSize - word.length + 1));
            } else if (rowDir === -1) { // Up
                row = Math.floor(Math.random() * (gridSize - word.length + 1)) + word.length - 1;
            } else { // No vertical movement
                row = Math.floor(Math.random() * gridSize);
            }
            
            if (colDir === 1) { // Right
                col = Math.floor(Math.random() * (gridSize - word.length + 1));
            } else if (colDir === -1) { // Left
                col = Math.floor(Math.random() * (gridSize - word.length + 1)) + word.length - 1;
            } else { // No horizontal movement
                col = Math.floor(Math.random() * gridSize);
            }
            
            if (canPlaceWord(word, row, col, direction)) {
                wordPositions[word] = {
                    start: {row, col},
                    direction: [rowDir, colDir],
                    letters: []
                };
                
                for (let i = 0; i < word.length; i++) {
                    const r = row + i * rowDir;
                    const c = col + i * colDir;
                    grid[r][c] = word[i];
                    wordPositions[word].letters.push({row: r, col: c});
                }
                placed = true;
            }
        }
        
        return placed;
    }
    
    function fillEmptySpaces() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === '') {
                    grid[i][j] = letters.charAt(Math.floor(Math.random() * letters.length));
                }
            }
        }
    }
    
    function renderGrid() {
        const table = document.getElementById('wordSearch');
        table.innerHTML = '';
        
        for (let i = 0; i < gridSize; i++) {
            const row = document.createElement('tr');
            
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('td');
                cell.textContent = grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                row.appendChild(cell);
            }
            
            table.appendChild(row);
        }
        
        addCellClickListeners();
    }
    
    function addCellClickListeners() {
        const cells = document.querySelectorAll('#wordSearch td');
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
    }
    
    function handleCellClick(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        for (const word in wordPositions) {
            const positions = wordPositions[word].letters;
            const isPartOfWord = positions.some(pos => pos.row === row && pos.col === col);
            
            if (isPartOfWord && !foundWords.has(word)) {
                highlightWord(word);
                foundWords.add(word);
                markWordAsFound(word);
                updateFoundCount();
                return;
            }
        }
        
        cell.classList.add('highlight');
        setTimeout(() => {
            cell.classList.remove('highlight');
        }, 500);
    }
    
    function highlightWord(word) {
        const positions = wordPositions[word].letters;
        positions.forEach(pos => {
            const cell = document.querySelector(`#wordSearch td[data-row="${pos.row}"][data-col="${pos.col}"]`);
            if (cell) {
                cell.classList.add('found-word');
            }
        });
    }
    
    function markWordAsFound(word) {
        const wordElement = document.querySelector(`#words-to-find li[data-word="${word}"]`);
        if (wordElement) {
            wordElement.classList.add('found');
        }
    }
    
    function generateWordSearch() {
        initializeGrid();
        
        // Filter out empty words and sort by length (longest first) for better placement
        activeWords = activeWords.filter(word => word.length > 0);
        activeWords.sort((a, b) => b.length - a.length);

        // Alert if too many words for the current input fields
        if (activeWords.length > wordInputs.length) { // Max words limited by input fields
             alert(`You can only enter up to ${wordInputs.length} words. Only the first ${wordInputs.length} words will be used.`);
             activeWords = activeWords.slice(0, wordInputs.length);
        }

        // Alert if words are too long for the grid
        if (activeWords.some(word => word.length > gridSize)) {
            alert('Some words are too long for the current grid size. Please reduce the length of words or increase the grid size (if implemented).');
            return; // Stop generation if words are too long for grid
        }
        
        let allPlaced = true;
        activeWords.forEach(word => {
            if (!placeWord(word)) {
                console.warn(`Could not place word: ${word}`);
                allPlaced = false;
            }
        });
        
        if (!allPlaced) {
            alert("Some words couldn't be placed. Try with fewer or shorter words or regenerate.");
        }
        
        fillEmptySpaces();
        renderGrid();
    }
});
