<template>
    <div id="app" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h3>{{ title }}</h3>
  
      <!-- Crossword Grid -->
      <crossword-grid :grid="grid" @update-grid="updateGrid" />
  
      <label for="gridSizeInput">Grid Size:</label>
      <input type="number" id="gridSizeInput" v-model="gridSize" @input="handleGridSizeChange"><br><br>
      <button @click="generateCrossword">Generate New Crossword Grid</button>
  
      <!-- Word Input -->
      <div class="word-input">
        <label for="words">Enter Words (separated by commas):</label>
        <textarea type="text" id="words" v-model="wordInput" @input="validateWordInput"></textarea><br><br>
        
        <!-- Buttons for showing/hiding answers -->
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;gap: 10px;">
          <q-btn class="glossy" rounded color="purple-12" @click="updateWordsGrid"  label="Generate Words"/>
          <q-btn class="glossy" rounded color="green-9" @click="showAnswers" label="Show Answers"/>
        </div><br><br>
      </div>
    </div>
  </template>
  
  <script>
  import CrosswordGrid from "../components/CrosswordGrid.vue";
  
  export default {
    name: "App",
    components: {
      CrosswordGrid,
    },
    data() {
      return {
        title: "Daily Crossword",
        gridSize: 20,
        grid: [],
        wordInput: "",
        originalGrid: [],
      };
    },
    created() {
      this.generateCrossword();
    },
    methods: {
      handleGridSizeChange() {
        this.gridSize = Math.max(Math.min(this.gridSize, 20), 5);
      },
     
      generateCrossword() {
        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
          const row = [];
          for (let j = 0; j < this.gridSize; j++) {
            row.push({ text: "", word: "", active: false, number: 0 });
          }
          this.grid.push(row);
        }
        this.updateWordsGrid();
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
      },
      updateGrid(updatedGrid) {
        this.grid = updatedGrid;
      },
      updateWordsGrid() {
        const words = this.wordInput.split(",").map(word => word.trim().toUpperCase());
        this.grid = this.generateCrosswordGrid(words, this.gridSize);
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.hideAnswers();
      },
      generateCrosswordGrid(words, gridSize) {
  const grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => ({ text: "", word: "", active: false, number: 0 })));

  const getRandomPosition = () => ({
    row: Math.floor(Math.random() * gridSize),
    col: Math.floor(Math.random() * gridSize)
  });

  const getRandomDirection = () => (Math.random() < 0.5 ? "across" : "down");

  const canPlaceWord = (word, row, col, direction) => {
    if (
      (direction === "across" && col + word.length > gridSize) ||
      (direction === "down" && row + word.length > gridSize)
    ) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      let r = direction === "across" ? row : row + i;
      let c = direction === "across" ? col + i : col;

      if (grid[r][c].text !== "" && grid[r][c].text !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      let r = direction === "across" ? row : row + i;
      let c = direction === "across" ? col + i : col;

      grid[r][c].text = word[i];
      grid[r][c].word = word;
      grid[r][c].active = true;

      if (i === 0) {
        grid[r][c].number = word.length;
      }
    }
  };

  const placeWordWithIntersections = (word) => {
    let intersectionCount = 0;

    while (intersectionCount < 2) {
      const { row, col } = getRandomPosition();
      const direction = getRandomDirection();

      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        intersectionCount++;
      }
    }
  };

  words.forEach(placeWordWithIntersections);

  return grid;
},



  
    
    hideAnswers() {
        this.grid = JSON.parse(JSON.stringify(this.originalGrid));
        this.grid.forEach(row => {
          row.forEach(cell => {
            cell.text = "";
          });
        });
      },
      showAnswers() {
        this.grid = JSON.parse(JSON.stringify(this.originalGrid));
      },
    },
  };
  </script>
  
  <style>
  .word-input {
    margin-top: 20px;
  }
  
  .blackcell {
    background-color: black;
  }
  
  /* Define background color for active cells */
  #app .crossword-grid-cell.active {
    background-color: white;
  }
  
  /* Define background color for inactive cells */
  #app .crossword-grid-cell:not(.active) {
    background-color: black;
    border: 1px solid white;
  }
  </style>
  