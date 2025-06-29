document.addEventListener('DOMContentLoaded', function() {
    const maxWords = 10;
    let gridSize = 15;
    let grid = [];
    let wordPositions = {};
    let foundWords = new Set();
    let activeWords = [];
    
    // Initialize word inputs
    const wordInputs = document.querySelectorAll('.word-inputs input');
    const generateBtn = document.getElementById('generate-btn');
    const statsDiv = document.querySelector('.stats');
    const wordListDiv = document.querySelector('.word-list');
    
    generateBtn.addEventListener('click', function() {
        activeWords = [];
        wordInputs.forEach(input => {
            const word = input.value.trim().toUpperCase();
            if (word.length >= 3 && word.length <= 12) {
                activeWords.push(word);
            }
        });
        
        if (activeWords.length > 0) {
            generateWordSearch();
            statsDiv.style.display = 'block';
            wordListDiv.style.display = 'block';
            document.getElementById('total-words').textContent = activeWords.length;
        } else {
            alert('Please enter at least one valid word (3-12 letters)');
        }
    });
    
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
            cell.classList.remove('found-word');
        });
    }
    
    function updateFoundCount() {
        const foundCount = foundWords.size;
        const totalWords = activeWords.length;
        document.getElementById('found-count').textContent = foundCount;
        document.getElementById('total-words').textContent = totalWords;
        
        if (foundCount === totalWords) {
            document.getElementById('congrats-message').style.display = 'block';
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
            
            if (rowDir === 1) {
                row = Math.floor(Math.random() * (gridSize - word.length));
            } else if (rowDir === -1) {
                row = Math.floor(Math.random() * (gridSize - word.length)) + word.length - 1;
            } else {
                row = Math.floor(Math.random() * gridSize);
            }
            
            if (colDir === 1) {
                col = Math.floor(Math.random() * (gridSize - word.length));
            } else if (colDir === -1) {
                col = Math.floor(Math.random() * (gridSize - word.length)) + word.length - 1;
            } else {
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
        
        // Sort words by length (longest first) for better placement
        activeWords.sort((a, b) => b.length - a.length);
        
        // Try to place each word
        let allPlaced = true;
        activeWords.forEach(word => {
            if (!placeWord(word)) {
                console.warn(`Could not place word: ${word}`);
                allPlaced = false;
            }
        });
        
        if (!allPlaced) {
            alert("Some words couldn't be placed. Try with fewer or shorter words.");
        }
        
        fillEmptySpaces();
        renderGrid();
    }
});
