// script.js
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20; // 各セルのサイズ
let drawing = []; // キャンバスの状態を保持する配列

function initializeCanvas(ctx, width, height, cellSize) {
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;
  drawGrid(ctx, width, height, cellSize);
  initializeDrawingArray(width, height); // drawing 配列を初期化する
}

// グリッドの描画
function drawGrid(ctx, width, height, cellSize) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // キャンバスをクリア
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      fillCell(ctx, i, j, cellSize, 0); // 初期状態を通路で塗りつぶす
    }
  }
}

// drawing 配列の初期化
function initializeDrawingArray(width, height) {
  drawing = []; // 既存の配列をクリアする
  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < width; x++) {
      row.push(0); // 初期状態を通路（0）で設定
    }
    drawing.push(row);
  }
}

// セルクリックハンドラ
function addCellClickHandler(canvas, ctx, cellSize) {
  canvas.addEventListener('click', function(e) {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    if (drawing[y] && drawing[y][x] !== undefined) {
      drawing[y][x] = drawing[y][x] === 0 ? 1 : 0; // 状態を切り替える
      fillCell(ctx, x, y, cellSize, drawing[y][x]);
    }
  });
}

// セルを塗りつぶす
function fillCell(ctx, x, y, cellSize, state) {
  ctx.fillStyle = state === 0 ? 'white' : 'black'; // 通路なら白、壁なら黒
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize); // グリッド線を再描画
}

function submitMaze() {
  console.log('Sending drawing:', drawing); // 送信前のデータ確認

  fetch('/generate/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
        width: canvas.width / cellSize,
        height: canvas.height / cellSize,
        drawing: drawing
    })
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

// ドキュメント読み込み後の初期化
document.addEventListener('DOMContentLoaded', function () {
  initializeCanvas(ctx, 24, 30, cellSize); // 仮の値
  addCellClickHandler(canvas, ctx, cellSize);
});