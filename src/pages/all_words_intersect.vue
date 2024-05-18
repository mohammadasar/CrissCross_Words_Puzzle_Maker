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
        <q-btn class="glossy" rounded color="purple-12" @click="updateWordsGrid" label="Generate Words"/>
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
      this.grid = Array.from({ length: this.gridSize }, () => Array.from({ length: this.gridSize }, () => ({ text: "", word: "", active: false, number: 0 })));
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
      const canPlaceWord = (word, row, col, direction) => {
  if ((direction === "across" && col + word.length > gridSize) ||
      (direction === "down" && row + word.length > gridSize)) {
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
  let placed = false;
  const intersections = [];

  // Find all intersections of the word with existing letters
  for (let i = 0; i < word.length; i++) {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c].text === word[i]) {
          intersections.push({ row: r, col: c, index: i });
        }
      }
    }
  }

  // Try to find a suitable intersection to place the word
  for (let { row, col, index } of intersections) {
    const directions = ["across", "down"];
    for (const direction of directions) {
      const newRow = direction === "across" ? row : row - index;
      const newCol = direction === "across" ? col - index : col;

      console.log("Trying to place word:", word, "at row:", newRow, "col:", newCol, "direction:", direction);

      // Check if the newRow and newCol are within bounds
      if (newRow >= 0 && newCol >= 0 && newRow < gridSize && newCol < gridSize) {
        if (canPlaceWord(word, newRow, newCol, direction)) {
          placeWord(word, newRow, newCol, direction);
          placed = true;
          break;
        }
      } else {
        console.log("Skipping invalid position for word:", word, "at row:", newRow, "col:", newCol, "direction:", direction);
      }
    }
    if (placed) break;
  }

  // If no suitable intersection is found, place the word randomly
  if (!placed) {
    let attempts = 0;
    while (attempts < 100) { // Limit the number of attempts to prevent infinite loop
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const direction = Math.random() < 0.5 ? "across" : "down";
      
      console.log("Trying random placement for word:", word, "direction:", direction, "row:", row, "col:", col);
      
      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
        break;
      } else {
        console.log("Failed to place word randomly:", word, "direction:", direction, "row:", row, "col:", col);
      }
      attempts++;
    }
    if (!placed) {
      console.log(`Failed to place word after multiple attempts: ${word}`);
    }
  }
};

words.forEach(placeWordWithIntersections);

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
}

/* Define background color for inactive cells */
#app .crossword-grid-cell:not(.active) {
  background-color: black;
  border: 1px solid white;
}
</style>
