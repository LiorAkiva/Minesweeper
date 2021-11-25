function getMat(rowsCount, colsCount) {
    var mat = [];
    for (var i = 0; i < rowsCount; i++) {
        mat[i] = [];
        for (var j = 0; j < colsCount; j++) {
            mat[i][j] = '';
        }
    }
    return mat
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

function getTime() {
    return new Date().toString().split(' ')[4];
}

function cl(x){
  console.log(x);
}

function sayDate(){
  cl(new Date()); // current date and time
  cl(new Date(1390457110008)); //milliseconds since 1970/01/01
  cl(new Date('2013-09-24')); // from string
  cl(new Date(2013, 8, 24, 9, 42, 999)); // explicit
}

function playSound(file) {
    var audio = new Audio(file)
    audio.play()
  }

  function drawNum() {
    var idx = getRandomInt(0, gNums.length)
    var num = gNums[idx]
    gNums.splice(idx, 1)
    return num
  }

  function shuffleCells(board) {
    for (var i = board.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var x = board[i];
        board[i] = board[j];
        board[j] = x;
    }
    return board;
}

function setTimer() {
  gStartTime = Date.now();
  gInterval = setInterval(function () {
      var elTimer = document.querySelector('.timer span');
      elTimer.innerText = ((Date.now() - gStartTime) / 5000).toFixed(2)
  }, 10);
}

 