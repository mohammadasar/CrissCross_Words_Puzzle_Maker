<template>
  <Navbar></Navbar>
  <div id="app" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h3  style="font-size: 50px;font-weight: bolder;" >{{ title }}</h3>

    <!-- Crossword Grid Component -->
    <TamilCrossgrid :grid="grid" @update-grid="updateGrid" />

    <!-- Word Input Section -->
    <div class="word-input">
      <label for="words" style="font-size: 25px;font-weight: 700;">Enter Words (separated by commas):</label><br>  
      <textarea id="words" v-model="wordInput" @input="validateWordInput" placeholder="Ex : Apple , Pen" class="q-pa-md" style="width: 500px;height: 250px;border-radius: 10px;"></textarea><br><br>

      <!-- Buttons for Generating and Showing Answers -->
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 10px;">
        <q-btn class="glossy" rounded color="indigo-9" @click="updateWordsGrid" label="Generate Words"/>
        <q-btn class="glossy" rounded color="green-9" @click="showAnswers" label="Show Answers"/>
      </div><br><br>
    </div>
  </div>
</template>

<script>
import TamilCrossgrid from "../components/CrosswordGrid.vue";
import GraphemeSplitter from 'grapheme-splitter';
import Navbar from '../components/Navbar.vue';

export default {
  name: "App",
  components: {
    TamilCrossgrid,
    Navbar
  },
  data() {
    return {
      title: "Daily Crossword English",
      grid: [],
      wordInput: "",
      originalGrid: [],
      splitter: new GraphemeSplitter(),
      wordCounter: 1, // Initialize word counter
    };
  },
  created() {
    this.generateCrossword();
  },
  methods: {
    generateCrossword() {
      this.grid = [];
      this.originalGrid = [];
      this.wordCounter = 1; // Reset word counter when generating a new crossword
    },
    updateGrid(updatedGrid) {
      this.grid = updatedGrid;
    },
    validateWordInput() {
      const alphabetPattern = /^[a-zA-Z\s,]*$/; // Regular expression to allow only alphabet characters
      if (!alphabetPattern.test(this.wordInput)) {
        alert("Please enter only alphabet words.");
        this.wordInput = this.wordInput.replace(/[^a-zA-Z,]/g, ""); // Replace non-alphabet characters
      }
    },
    updateWordsGrid() {
      const words = this.wordInput.split(",").map(word => word.trim());
      const gridSize = this.calculateGridSize(words);
      this.grid = this.generateCrosswordGrid(words, gridSize);
      this.originalGrid = JSON.parse(JSON.stringify(this.grid));
      this.hideAnswers();
    },
    calculateGridSize(words) {
      const longestWordLength = Math.max(...words.map(word => this.splitter.splitGraphemes(word).length));
      const wordCount = words.length;
      return Math.max(longestWordLength, Math.ceil(Math.sqrt(wordCount * longestWordLength))) + 2; // Adding some buffer
    },
    generateCrosswordGrid(words, gridSize) {
  const grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => ({ text: "", word: "", active: false, number: 0 })));

  const canPlaceWord = (word, row, col, direction) => {
    const graphemes = this.splitter.splitGraphemes(word);
    if ((direction === "across" && col + graphemes.length > gridSize) ||
        (direction === "down" && row + graphemes.length > gridSize)) {
      return false;
    }

    for (let i = 0; i < graphemes.length; i++) {
      let r = direction === "across" ? row : row + i;
      let c = direction === "across" ? col + i : col;

      if (grid[r][c].text !== "" && grid[r][c].text !== graphemes[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (word, row, col, direction, wordIndex) => {
    const graphemes = this.splitter.splitGraphemes(word);

    for (let i = 0; i < graphemes.length; i++) {
      let r = direction === "across" ? row : row + i;
      let c = direction === "across" ? col + i : col;

      if (i === 0 && grid[r][c].number === 0) {
        grid[r][c].number = wordIndex + 1; // Assign the word index plus one as the number only for the first character of the word
      }

      grid[r][c].text = graphemes[i];
      grid[r][c].word = word;
      grid[r][c].active = true;
    }
  };

  const findIntersections = (word) => {
    const graphemes = this.splitter.splitGraphemes(word);
    const intersections = [];

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c].text !== "" && graphemes.includes(grid[r][c].text)) {
          intersections.push({ row: r, col: c, letter: grid[r][c].text });
        }
      }
    }
    return intersections;
  };

  const placeWordWithIntersections = (word, wordIndex) => {
    let placed = false;
    const intersections = findIntersections(word);

    for (let { row, col, letter } of intersections) {
      const letterIndex = this.splitter.splitGraphemes(word).indexOf(letter);
      const directions = ["across", "down"];

      for (const direction of directions) {
        let startRow = row - (direction === "across" ? 0 : letterIndex);
        let startCol = col - (direction === "across" ? letterIndex : 0);

        if (startRow >= 0 && startCol >= 0 && startRow < gridSize && startCol < gridSize) {
          if (canPlaceWord(word, startRow, startCol, direction)) {
            placeWord(word, startRow, startCol, direction, wordIndex);
            placed = true;
            break;
          }
        }
      }
      if (placed) break;
    }

    if (!placed) {
      let attempts = 0;
      while (attempts < 100) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const direction = Math.random() < 0.5 ? "across" : "down";

        if (canPlaceWord(word, row, col, direction)) {
          placeWord(word, row, col, direction, wordIndex);
          placed = true;
          break;
        }
        attempts++;
      }
    }
  };

  words.forEach((word, index) => placeWordWithIntersections(word, index));

  return grid;
},




    hideAnswers() {
      this.grid = this.grid.map(row => row.map(cell => ({ ...cell, text: cell.active ? "" : cell.text })));
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
  font-family: 'Latha', 'Noto Sans Tamil', sans-serif; /* Ensure Tamil characters display correctly */
  font-size: 16px; /* Adjust font size for better readability */
  text-align: center;
  vertical-align: middle;
  line-height: 1.5; /* Adjust line height for better vertical alignment */
}

/* Define background color for inactive cells */
#app .crossword-grid-cell:not(.active) {
  background-color: black;
  border: 1px solid white;
  color: white; /* Change text color for better visibility */
}

.crossword-grid-cell .cell-number {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 10px;
  font-weight: bold;
}
</style>

