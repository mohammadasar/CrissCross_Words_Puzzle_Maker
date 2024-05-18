<template>
    <div id="app" class="container">
      <h1>Crisscross Word Puzzle Creator</h1>
      <div class="form-group">
        <label for="word">Enter a Word:</label>
        <input type="text" v-model="word" class="form-control" id="word" placeholder="Enter a word">
      </div>
      <button @click="addWord" class="btn btn-primary">Add Word</button>
      <hr>
      <div>
        <h2>Word List</h2>
        <ul>
          <li v-for="(word, index) in words" :key="index">{{ word }}</li>
        </ul>
      </div>
      <hr>
      <h2>Crisscross Word Puzzle</h2>
      <div class="puzzle">
        <table>
          <tbody>
            <tr v-for="(row, rowIndex) in puzzle" :key="rowIndex">
              <td v-for="(cell, colIndex) in row" :key="colIndex">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr>
      <div v-if="intersectWord">
        <h2>Intersecting Word</h2>
        <p>{{ intersectWord }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        word: '',
        words: [],
        rows: 10,
        cols: 10,
        directions: ['across', 'down'],
        puzzle: [],
        intersectWord: ''
      };
    },
    methods: {
      addWord() {
        if (this.word) {
          this.words.push(this.word);
          this.word = '';
          this.updatePuzzle();
        }
      },
      updatePuzzle() {
        this.puzzle = [];
        for (let i = 0; i < this.rows; i++) {
          this.puzzle.push(Array(this.cols).fill(''));
        }
        this.words.forEach(word => {
          let placed = false;
          while (!placed) {
            const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
            let row = Math.floor(Math.random() * this.rows);
            let col = Math.floor(Math.random() * this.cols);
            let wordFits = true;
            for (let i = 0; i < word.length; i++) {
              if (row >= this.rows || col >= this.cols || (this.puzzle[row][col] !== '' && this.puzzle[row][col] !== word[i])) {
                wordFits = false;
                break;
              }
              if (direction === 'across') {
                col++;
              } else {
                row++;
              }
            }
            if (wordFits) {
              row = Math.floor(Math.random() * this.rows);
              col = Math.floor(Math.random() * this.cols);
              for (let i = 0; i < word.length; i++) {
                this.puzzle[row][col] = word[i];
                if (direction === 'across') {
                  col++;
                } else {
                  row++;
                }
              }
              placed = true;
            }
          }
        });
      },
      findIntersectWord(row, col) {
        const acrossWord = this.getWord(row, col, 'across');
        const downWord = this.getWord(row, col, 'down');
        if (acrossWord && downWord) {
          this.intersectWord = `${acrossWord} intersects with ${downWord}`;
        } else {
          this.intersectWord = '';
        }
      },
      getWord(row, col, direction) {
        let word = '';
        let currentRow = row;
        let currentCol = col;
        while (currentRow >= 0 && currentCol >= 0 && currentRow < this.rows && currentCol < this.cols && this.puzzle[currentRow][currentCol] !== '') {
          word += this.puzzle[currentRow][currentCol];
          if (direction === 'across') {
            currentCol--;
          } else {
            currentRow--;
          }
        }
        return word.split('').reverse().join('');
      }
    },
    mounted() {
      this.updatePuzzle();
    }
  };
  </script>
  
  <style scoped>
  .puzzle table {
    border-collapse: collapse;
  }
  
  .puzzle td {
    border: 1px solid black;
    width: 30px;
    height: 30px;
    text-align: center;
  }
  </style>
  