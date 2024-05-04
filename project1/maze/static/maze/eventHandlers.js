let lastClicked = { x: -1, y: -1 };  // 初期値を無効な座標に設定
let clickedCells = [];  // クリックされたセルの配列を保持

canvas.addEventListener('click', function(e) {
  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);
  // 座標が有効範囲内であり、以前にクリックされたセルでないことを確認
  if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight || clickedCells.some(cell => cell.x === x && cell.y === y)) return;

  if (isNeighbor(lastClicked.x, lastClicked.y, x, y) || lastClicked.x === -1) {
    // セルをクリック済みリストに追加
    clickedCells.push({ x, y });
    lastClicked = { x, y };  // クリック位置を更新
    markCellAsClicked(x, y);
    highlightNeighbors(x, y);
  }
});

function markCellAsClicked(x, y) {
  // クリックされたセルを赤で塗りつぶす
  ctx.fillStyle = 'red';
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function isNeighbor(x1, y1, x2, y2) {
  // 隣接しているかを判定（直接の縦横のみを考慮）
  return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}

function highlightNeighbors(x, y) {
  // 全体をリセットして青を塗る条件を更新
  resetCanvas();
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      if ((Math.abs(x - i) === 1 && y === j) || (Math.abs(y - j) === 1 && x === i)) {
        if (!clickedCells.some(cell => cell.x === i && cell.y === j)) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
  }
}

function resetCanvas() {
  // キャンバスをリセットし、クリックされたセルを赤で塗りつぶす
  drawGrid();
  clickedCells.forEach(cell => {
    markCellAsClicked(cell.x, cell.y);
  });
}


function breakWallBetween(x1, y1, x2, y2) {
  // x1, y1 と x2, y2 の間の壁を壊す
  if (x1 === x2) {  // 同じ行にある場合、縦の壁を壊す
    if (y1 > y2) [y1, y2] = [y2, y1];  // y1 が常に小さい値になるように交換
    ctx.clearRect(x1 * cellSize, (y1 + 1) * cellSize, cellSize, cellSize - 2);
  } else if (y1 === y2) {  // 同じ列にある場合、横の壁を壊す
    if (x1 > x2) [x1, x2] = [x2, x1];  // x1 が常に小さい値になるように交換
    ctx.clearRect((x1 + 1) * cellSize, y1 * cellSize, cellSize - 2, cellSize);
  }
}

canvas.addEventListener('click', function(e) {
  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);

  if ((x === lastClicked.x && y === lastClicked.y) || (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight)) return;

  if (isNeighbor(lastClicked.x, lastClicked.y, x, y) || lastClicked.x === -1) {
    if (lastClicked.x !== -1) {
      breakWallBetween(lastClicked.x, lastClicked.y, x, y);  // 壁を壊す処理を呼び出し
    }
    clickedCells.push({ x, y });
    markCellAsClicked(x, y);
    highlightNeighbors(x, y);
    lastClicked = { x, y };
  }
});

// 隣接しているかを判定（直接の縦横のみを考慮）
function isNeighbor(x1, y1, x2, y2) {
  return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}
