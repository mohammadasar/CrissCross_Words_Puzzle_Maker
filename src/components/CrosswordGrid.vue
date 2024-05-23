<template>
  <div class="crossword-grid">
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="crossword-grid-row">
      <div
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        class="crossword-grid-cell"
        :class="{ active: cell.active }"
      >
        <span v-if="cell.number" class="cell-number">{{ cell.number }}</span>
        <span class="cell-content">{{ cell.text.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TamilCrossgrid",
  props: {
    grid: {
      type: Array,
      required: true
    }
  },
};
</script>

<style scoped>
.crossword-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.crossword-grid-row {
  display: flex;
}

.crossword-grid-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.crossword-grid-cell.active {
  background-color: white;
}

.cell-number {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 10px;
  font-weight: bold;
}
.text{
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell-content {
  font-size: 20px;
  font-weight: bolder;
}
</style>
