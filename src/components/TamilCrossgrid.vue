<template>
    <div class="crossword-grid">
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="crossword-grid-row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="['crossword-grid-cell', { 'active': cell.active }]">
          {{ cell.text }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      grid: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .crossword-grid {
    display: flex;
    flex-direction: column;
  }
  
  .crossword-grid-row {
    display: flex;
  }
  
  .crossword-grid-cell {
    width: 30px;
    height: 30px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .crossword-grid-cell.active {
    background-color: white;
  }
  
  .crossword-grid-cell:not(.active) {
    background-color: rgb(24, 5, 95);
  }
  </style>
  