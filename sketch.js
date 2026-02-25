// 全域變數
let shapes = [];
let song;
let amplitude;

// 外部定義的多邊形頂點基礎座標 (例如一個不規則的六邊形)
let points = [
  [-3, 5],
  [5, 6],
  [8, 0],
  [5, -6],
  [-3, -5],
  [-6, 0]
];

function preload() {
  // 在程式開始前預載入外部音樂資源
  // 請確保 'midnight-quirk-255361.mp3' 檔案存在於專案目錄中，否則會出現 404 錯誤
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 初始化畫布，建立符合視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 將變數 amplitude 初始化為 new p5.Amplitude()
  amplitude = new p5.Amplitude();

  // 使用 for 迴圈產生 10 個形狀物件，並 push 到 shapes 陣列中
  for (let i = 0; i < 10; i++) {
    let shapePoints = points.map(pt => {
      // 將每個頂點的 x 與 y 分別乘上 10 到 30 之間的隨機倍率來產生變形
      return {
        x: pt[0] * random(10, 30),
        y: pt[1] * random(10, 30)
      };
    });

    let shape = {
      x: random(0, windowWidth), // 0 到 windowWidth 之間的隨機亂數
      y: random(0, windowHeight), // 0 到 windowHeight 之間的隨機亂數
      dx: random(-3, 3), // -3 到 3 之間的隨機亂數
      dy: random(-3, 3), // -3 到 3 之間的隨機亂數
      scale: random(1, 10), // 1 到 10 之間的隨機亂數
      color: color(random(255), random(255), random(255)), // 隨機生成的 RGB 顏色
      points: shapePoints
    };

    shapes.push(shape);
  }
}

function draw() {
  // 設定背景顏色為 '#ffcdb2'
  background('#ffcdb2');

  // 設定邊框粗細 strokeWeight(2)
  strokeWeight(2);

  // 透過 amplitude.getLevel() 取得當前音量大小（數值介於 0 到 1）
  let level = amplitude.getLevel();

  // 使用 map() 函式將 level 從 (0, 1) 的範圍映射到 (0.5, 2) 的範圍
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 使用 for...of 迴圈走訪 shapes 陣列中的每個 shape 進行更新與繪製
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > width) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > height) {
      shape.dy *= -1;
    }

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y);
    // 依照音樂音量縮放圖形
    scale(sizeFactor);

    // 繪製多邊形
    beginShape();
    for (let pt of shape.points) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }
}

// 處理視窗大小改變 (雖然 JSON 未強制要求，但通常是 p5.js 最佳實踐)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 為了符合瀏覽器自動播放策略，通常建議加入點擊開始播放的功能
function mousePressed() {
  if (song.isLoaded()) {
    if (song.isPlaying()) {
      song.stop(); // 如果正在播放，則停止
    } else {
      song.loop(); // 如果停止，則開始循環播放
    }
  }
}
