<!-- old -->
<template>
  <div id="app" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h3>{{ title }}</h3>

    <!-- Crossword Grid -->
    <crossword-grid :grid="grid" @update-grid="updateGrid" />

    <label for="gridSizeInput">Grid Size:</label>
    <input type="number" id="gridSizeInput" v-model="gridSize" @input="handleGridSizeChange"><br><br>
    <button @click="generateCrossword">Generate New Crossword Grid</button>

    <!-- Word Input -->
    <div class="word-input" >
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
      gridSize: 15, // Adjust as needed
      grid: [],
      wordInput: "",
      originalGrid: [], // Store the original grid for hiding/showing answers

    };
  },
  created() {
    this.generateCrossword();
  },
  methods: {
    handleGridSizeChange() {
      // Optionally, you can add validation here to ensure gridSize is within an acceptable range
      // For example, if you want gridSize to be at least 5 and at most 20:
      this.gridSize = Math.max(Math.min(this.gridSize, 20), 5);
    },

    generateCrossword() {
      // Generate empty crossword grid
      this.grid = [];
      for (let i = 0; i < this.gridSize; i++) {
        const row = [];
        for (let j = 0; j < this.gridSize; j++) {
          row.push({ text: "", word: "", active: false }); // Add 'active' property
        }
        this.grid.push(row);
      }

      // Update grid with user input words
      this.updateWordsGrid();
      // Store the original grid for later use
      this.originalGrid = JSON.parse(JSON.stringify(this.grid));
    },

    updateGrid(updatedGrid) {
      this.grid = updatedGrid;
    },

    validateWordInput() {
      // Remove non-alphabetic characters from wordInput
      this.wordInput = this.wordInput.replace(/[^A-Za-z,\s]/g, '');
    },

    updateWordsGrid() {
      // Parse words input and store them
      const words = this.wordInput.split(",").map(word => word.trim().toUpperCase());

      // Generate crossword grid with intersecting words
      this.grid = this.generateCrosswordGrid(words, this.gridSize);
       // Store the original grid for later use
       this.originalGrid = JSON.parse(JSON.stringify(this.grid));
       
      // Hide the answers by clearing the 'text' property of each cell
      this.hideAnswers();
    },

    generateCrosswordGrid(words, gridSize) {
      // Sort words by length in descending order
      words.sort((a, b) => b.length - a.length);

      // Create an empty grid
      const grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => ({ text: "", word: "", active: false })));

      // Function to check if a word fits at a given position
      const canPlaceWord = (word, row, col, direction) => {
        // Check if word fits within grid bounds
        if (
          (direction === "across" && col + word.length > gridSize) ||
          (direction === "down" && row + word.length > gridSize) ||
          (direction === "diagonal" && (col + word.length > gridSize || row + word.length > gridSize)) ||
          (direction === "reverse" && (col - word.length < -1 || row - word.length < -1))
        )
          return false;

        // Check for intersections with existing letters
        for (let i = 0; i < word.length; i++) {
          let r, c;
          
          if (direction === "across") {
            r = row;
            c = col + i;
            console.log("across===========")
          } else if (direction === "down") {
            r = row + i;
            c = col;
          } else if (direction === "diagonal") {
            r = row + i;
            c = col + i;
          } else if (direction === "reverse") {
            r = row - i;
            c = col - i;
          }

          if (grid[r][c].text !== "" && grid[r][c].text !== word[i]) return false;
        }
        return true;
      };

      // Function to place a word in the grid
      const placeWord = (word, row, col, direction) => {
        for (let i = 0; i < word.length; i++) {
          let r, c;
          if (direction === "across") {
            r = row;
            c = col + i;
          } else if (direction === "down") {
            r = row + i;
            c = col;
          } else if (direction === "diagonal") {
            r = row + i;
            c = col + i;
          } else if (direction === "reverse") {
            r = row - i;
            c = col - i;
          }

          grid[r][c].text = word[i];
          grid[r][c].word = word;
          grid[r][c].active = true; // Mark cell as active
        }
      };

      // Function to find a valid position for a word
      const findValidPosition = word => {
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            if (canPlaceWord(word, row, col, "across")) return { row, col, direction: "across" };
            if (canPlaceWord(word, row, col, "down")) return { row, col, direction: "down" };
            if (canPlaceWord(word, row, col, "diagonal")) return { row, col, direction: "diagonal" };
            if (canPlaceWord(word, row, col, "reverse")) return { row, col, direction: "reverse" };
          }
        }
        return null; // No valid position found
      };

      // Place each word in the grid
      for (const word of words) {
        const position = findValidPosition(word);
        if (position) placeWord(word, position.row, position.col, position.direction);
        else console.error("Unable to place word:", word); // Log error if unable to place word
      }
      return grid;
     
    },
      // Method to hide answers
      hideAnswers() {
      // Reset grid to the original grid without answers
      this.grid = JSON.parse(JSON.stringify(this.originalGrid));
      // Hide the answers by clearing the 'text' property of each cell
      this.grid.forEach(row => {
        row.forEach(cell => {
          cell.text = "";
        });
      });
    },

    // Method to show answers
    showAnswers() {
      // Set grid to the original grid with answers
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
