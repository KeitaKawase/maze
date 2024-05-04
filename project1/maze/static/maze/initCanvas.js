// グローバル変数として canvas, ctx, gridWidth, gridHeight を定義
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let gridWidth, gridHeight; // グリッドの幅と高さ
const cellSize = 20; // セルのサイズ

function initializeCanvas(width, height) {
  gridWidth = width; // グリッドの幅をセット
  gridHeight = height; // グリッドの高さをセット
  console.log('Initializing canvas with width:', width, 'height:', height);
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;
  drawGrid();
  markInitialClickableCells();
}

function drawGrid() {
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      ctx.fillStyle = 'white';
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function markInitialClickableCells() {
  for (let i = 0; i < gridWidth; i++) {
    markCellAsClickable(i, 0);
    markCellAsClickable(i, gridHeight - 1);
  }
  for (let j = 1; j < gridHeight - 1; j++) {
    markCellAsClickable(0, j);
    markCellAsClickable(gridWidth - 1, j);
  }
}

function markCellAsClickable(x, y) {
  ctx.fillStyle = 'blue';
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}
