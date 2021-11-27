'use strict';


//reset the data of the game
function setGame() {
    gGame = {
        isGameOver: false,
        shownCount: 0,
        markedCount: 0,
        secondsPassed: 0,
        boardSteps: []
    }
    return gGame;
}

function setHelp() {
    gLives = 3;
    gHints = 3;
    gSafes = 3;
    gIsHint = false;
    gIsSafe = false;
    gFirstMove = 0;
    gSafeCell = {
        rowIdx: 0,
        colIdx: 0
    }
}

// builds a mat according to the picked level
// place on each row number of cells containing information on cell
function buildBoard(boardSize) {
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        var currRow = [];
        for (var j = 0; j < boardSize; j++) {
            var currCell = {
                i,
                j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            currRow.push(currCell);
        }
        board.push(currRow);
    }
    return board;
}

// gets coordinates of random cell location to place mines
function getMineCells(board, minesAmount, cellIdx) {
    var mineCount = 0;
    while (mineCount < minesAmount) {
        var i = getRandomInt(0, board.length);
        var j = getRandomInt(0, board[0].length);
        if (cellIdx === board[i][j] && gFirstMove === 0) continue;
        if (!board[i][j].isMine && !board[i][j].isShown) {
            board[i][j].isMine = true;
            mineCount++;
        }
    }
}

// checks mines around cell and returns count
function setMinesNegsCount(board, rowIdx, colIdx) {
    var mineCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine === true) mineCount++;
        }
    }
    return mineCount;
}

function revealNegs(rowIdx, colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
          if (j < 0 || j > gBoard[i].length - 1) continue;
          if (i === rowIdx && j === colIdx) continue;
          var negCells = setMinesNegsCount(gBoard, i, j);
          if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.classList.remove('hidden');
            if(negCells === 0){
                elCell.innerText ='';
            } else{
            elCell.innerText = negCells;
            elCell.isShown = true;
            }
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
            if (negCells === 0){
                elCell.isShown = true;
             revealNegs(i, j);
            }    
          }
        }
      }
}

// shows neighboring cells around a chosen cell.
function hintRevealNegs(hint, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue;
            var negCells = setMinesNegsCount(gBoard, i, j);
            if (!gBoard[i][j].isShown) {
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                if (hint) {
                    elCell.classList.remove('hidden');
                    if (gBoard[i][j].isMine) {
                        elCell.innerText = MINE_IMG;
                        continue;
                    }
                    elCell.innerText = negCells;
                } 
                else {
                    elCell.classList.add('hidden');
                    elCell.innerText = '';
                }
            }
        }
    }
}

function safeRevealCell(safe){
    if(gGame.shownCount === gBoard.length ** 2 - gMine) return;
    var isFound = false;
    var rowIdx;
    var colIdx;
    if(safe === true){
    while(isFound === false){
        rowIdx = getRandomInt(0, gBoard.length);
        colIdx = getRandomInt(0, gBoard[0].length);
        var currCell = gBoard[rowIdx][colIdx]
        if(currCell.isShown || currCell.isMine || currCell.isMarked) continue;
        gSafeCell.rowIdx = rowIdx;
        gSafeCell.colIdx = colIdx;
        isFound = true;
    }
    }
    console.log(gSafeCell.rowIdx)
    var elCell = document.querySelector(`.cell-${gSafeCell.rowIdx}-${gSafeCell.colIdx}`);
    if(safe === true || isFound === true){
        elCell.classList.remove('hidden');
        elCell.classList.add('safeZone');
    }else {
        elCell.classList.add('hidden');
        elCell.classList.remove('safeZone');
    }
}

// keeps user's move inside a mat.
function keepBoardSteps(board) {
    var boardSteps = [];
    for (var i = 0; i < board.length; i++) {
        boardSteps[i] = [];
        for (var j = 0; j < board.length; j++){     
            var currIsShown =  board[i][j].isShown;
            var currIsMine = board[i][j].isMine;
            var currIsMarked = board[i][j].isMarked;
            var boardCell = {
                isShown: currIsShown,
                isMine : currIsMine,
                isMarked : currIsMarked,
            }
            boardSteps[i][j] = boardCell;
        }
    }
    return boardSteps;
  }

// checks if all conditions for victory are met
// changes h3 to "victory"
function checkVictory() {
    var elHeader = document.querySelector('h3');
    if (gGame.shownCount === gBoard.length ** 2 - gMine) {
        if (gGame.markedCount === gMine || gMinesCount === 0) {
            gGame.isGameOver = true;
            elHeader.innerText = WINNER_IMG;
            clearInterval(gInterval);
        }
    }
}

// checks if game is over and changes h3 to "lose"
function checkGameOver() {
    if (gGame.isGameOver === true) {
        var elHeader = document.querySelector('h3');
        elHeader.innerText = LOSER_IMG;
        for(var i= 0; i< gBoard.length; i++){
            for(var j = 0; j < gBoard.length; j++){
                var currCell = gBoard[i][j];
                if(currCell.isMine === true){
                    var elCell = document.querySelector(`.cell-${i}-${j}`);
                    elCell.classList.remove('hidden');
                    elCell.innerText = MINE_IMG;
                }
            }
        }
        clearInterval(gInterval);
    }
}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}