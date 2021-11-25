'use strict';


//reset the data of the game
function setGame(){
    gGame = {
        isGameOver: false,
        shownCount : 0,
        markedCount:0,
        secondsPassed:0
    }
    return gGame;
}

// builds a mat according to the picked level
// place on each row number of cells containing information on cell
function buildBoard(boardSize){
    var board = [];
    for(var i = 0; i < boardSize; i++){
        var currRow = [];
        for(var j = 0; j < boardSize; j++){
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
function getMineCells(board, minesAmount){
    var mineCount= 0
    while (mineCount < minesAmount) {
        var i = getRandomInt(0, board.length)
        var j = getRandomInt(0, board.length)
        if (!board[i][j].isMine && !board[i][j].isShown) {
            board[i][j].isMine = true
            mineCount++
        }
    }
    return board
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
            if (cell.isMine === true) mineCount++
        }
    }
    return mineCount
}

// checks if all conditions for victory are met
// changes h3 to "victory"
function checkVictory(){
    var elHeader = document.querySelector('h3');
    if(gGame.markedCount === gMine && gGame.shownCount === gBoard.length ** 2 - gMine){
        gGame.isGameOver = true;
        elHeader.innerText = WINNER_IMG;
        clearInterval(gInterval);
    }
}

// checks if game is over and changes h3 to "lose"
function checkGameOver(){
    if(gGame.isGameOver === true){
        var elHeader = document.querySelector('h3');
        elHeader.innerText = LOSER_IMG;
        clearInterval(gInterval);
    }
}



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}