# Quasar App (puzzle-maker)

puzzlemakers

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

employee,student,tutorial,continue,computer,according,accomadation,asarutheen,possitive,negative

Abstract,Banquet,Cascade,Dolphin,Exquisite,Fjord,Gazebo,Harpoon,Icicle,Jubilee,Kaleidoscope,Labyrinth,Monsoon,Nebula,Oasis,Palindrome,Quarantine,Renaissance,Symphony,Tapestry
,Umbrella,Vortex,Whimsical,Xylophone,Zephyr


    காற்று,கடல்,மரம்,மலர்,அன்னம்,மீன்,மழை,சூரியன்,நிலா,நதி,பசு,வீடு,மனிதன்,பெண்,குழந்தை,நீர்,நிலம்,அப்பம்,மிட்டாய்,பாடல் 

     காற்று
     கடல்
     மரம்
     மலர்
     அன்னம்
     மீன்
     மழை
     சூரியன்
     நிலா
     நதி
     பசு
     வீடு
     மனிதன்
     பெண்
     குழந்தை
     நீர்
     நிலம்
     அப்பம்
     மிட்டாய்
     பாடல் 


     வரவேற்கிறோம்,மாலைவணக்கம்,தங்கைமன்னிக்கவும்,கன்னம்,முழங்கால்,முகம்,சிங்கம்


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

      const placeWord = (word, row, col, direction) => {
        const graphemes = this.splitter.splitGraphemes(word);
  
        for (let i = 0; i < graphemes.length; i++) {
          let r = direction === "across" ? row : row + i;
          let c = direction === "across" ? col + i : col;
  
          grid[r][c].text = graphemes[i];
          grid[r][c].word = word;
          grid[r][c].active = true;
  
          if (i === 0) {
            grid[r][c].number = graphemes.length;
          }
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

      const placeWordWithIntersections = (word) => {
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
                placeWord(word, startRow, startCol, direction);
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
              placeWord(word, row, col, direction);
              placed = true;
              break;
            }
            attempts++;
          }
        }
      };

      words.forEach(placeWordWithIntersections);

      return grid;
    },