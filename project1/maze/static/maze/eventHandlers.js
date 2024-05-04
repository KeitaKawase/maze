let lastClicked = { x: -1, y: -1 };
let clickedCells = [];

canvas.addEventListener('click', function(e) {
  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);

  // 座標が有効範囲内であり、以前にクリックされたセルでないことを確認
  if (x < 0 || y < 0 || x >= gridWidth || y >= gridHeight || clickedCells.some(cell => cell.x === x && cell.y === y)) return;

  // クリックされたセルが前のセルの隣接するセルか、最初のクリックかを確認
  if (isNeighbor(lastClicked.x, lastClicked.y, x, y) || lastClicked.x === -1) {
    resetCanvas();  // キャンバスをリセット
    if (lastClicked.x !== -1) {
      breakWallBetween(lastClicked.x, lastClicked.y, x, y);  // 壁を壊す処理
    }
    clickedCells.push({ x, y });
    markCellAsClicked(x, y);  // セルを赤でマーク
    highlightNeighbors(x, y);  // 隣接するセルを青でハイライト
    lastClicked = { x, y };  // クリック位置を更新
  }
});

function resetCanvas() {
  drawGrid();  // グリッドを再描画
  clickedCells.forEach(cell => {
    markCellAsClicked(cell.x, cell.y);  // 既にクリックされたセルを赤で塗りつぶす
  });
}

function highlightNeighbors(x, y) {
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




function breakWallBetween(x1, y1, x2, y2) {
  console.log(`Attempting to break wall between (${x1}, ${y1}) and (${x2}, ${y2})`);

  if (x1 === x2) {
    if (y1 > y2) [y1, y2] = [y2, y1];
    console.log(`Breaking vertical wall between (${x1}, ${y1}) and (${x1}, ${y2})`);
    ctx.clearRect(x1 * cellSize, (y1 + 1) * cellSize, cellSize, cellSize);
  } else if (y1 === y2) {
    if (x1 > x2) [x1, x2] = [x2, x1];
    console.log(`Breaking horizontal wall between (${x1}, ${y1}) and (${x2}, ${y1})`);
    ctx.clearRect((x1 + 1) * cellSize, y1 * cellSize, cellSize, cellSize);
  }
}

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


function submitMaze() {
  const sendData = {
      width: canvas.width / cellSize,
      height: canvas.height / cellSize,
      drawing: clickedCells
  };
  console.log("Sending data:", sendData);
  console.log("Clicked cells:", clickedCells.map(cell => `x: ${cell.x}, y: ${cell.y}`));  // 各セルの座標を出力
  fetch('/generate/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(sendData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.redirect_url) {
          window.location.href = data.redirect_url;
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });

}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}