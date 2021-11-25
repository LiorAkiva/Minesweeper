'use strict';

// Global variables

const LOSER_IMG = '😣'
const GAME_IMG = '🙂'
const WINNER_IMG = '😎'
const MINE_IMG = '💣';
const FLAG_IMG = '🚩';

var gInterval;
var gFirstMove;
var gBoard;
var gGame;
var gLevels;
var gMarked;
var gLevel = 4;
var gMinesCount;
var gMine = 2;
var gLives;




// initialize all global variables and board
function initGame() {
    gGame = setGame();
    gLives = 3;
    gFirstMove = 0;
    gMarked = gMine;
    gMinesCount = gMine;
    changeSubtexts();
    gBoard = buildBoard(gLevel, gMine);
    renderBoard(gBoard);
}

// renders board on page as a table with cells
function renderBoard(board){
    var idx = 0;
    var strHTML = '';
    for (var i = 0; i < gLevel; i++) {
        strHTML += ('<tr>');
        for (var j = 0; j < gLevel; j++) {
            strHTML += (`<td class= "hidden"  oncontextmenu="cellMarked(this,event, ${i},${j})" onclick="cellClicked(this,${i}, ${j})"></td>`);   
            }
            strHTML += ('</tr>');
        }
        // console.log(board)
        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;
}


// when left click - checks what kind of cell and acts accordingly
// start time upon first click(left/right) checks each time if GAMEOVER/GAMEWON
function cellClicked(elCell, i, j){
    if(gGame.isGameOver === true) return;
    if(gFirstMove === 0){
        setTimer();
        gFirstMove++;
        getMineCells(gBoard, gMine)
    }
    if(elCell.isMarked === true || elCell.isShown === true) return;
    if(gBoard[i][j].isMine === true){
        gMinesCount--;
        changeSubtexts();
        elCell.style.backgroundColor = 'rgb(214, 66, 66)';
        elCell.innerText = MINE_IMG;
        gGame.isGameOver = true;
        return checkGameOver();
    }
    var negCells = setMinesNegsCount(gBoard,i, j);
    if(negCells === 0){
        elCell.style.backgroundColor = 'rgb(179, 164, 164)';
        gGame.shownCount++;
    } else {
        elCell.isShown = true;
        elCell.style.backgroundColor = 'rgb(179, 164, 164)';
        elCell.innerText = negCells;
        gGame.shownCount++;
    }
    checkVictory();

}

// when right click - marks cell believed to be a mine
// start time upon first click(left/right) checks each time if GAMEOVER/GAMEWON
function cellMarked(elCell){
    event.preventDefault();
    if(gGame.isGameOver !== true){
    if(gFirstMove === 0){
        setTimer();
        gFirstMove++;
    }
        if(elCell.isMarked === false && elCell.isShown === false) return;
        if(elCell.isMarked === true){
            elCell.isMarked = false;
            elCell.style.backgroundColor = '#777'
            elCell.innerText = '';
            gMinesCount++;
            gGame.markedCount--;
            changeSubtexts();
        } else if(gMinesCount !== 0) {
            elCell.isMarked = true;
            elCell.style.backgroundColor = 'gold'
            elCell.innerText = FLAG_IMG;
            gMinesCount--;
            gGame.markedCount++;
            changeSubtexts();
        }
    }
    checkVictory();
}    


// changes h3 head to either win/reset
function changeSubtexts(){
    var elHeader = document.querySelector('h3');
    if ( gMinesCount > -1){
    var elMinesLeft = document.querySelector('.mines-left span');
    elMinesLeft.innerText = gMinesCount;
    }
    if(gGame.isGameOver === true){
        elHeader.innerText = WINNER_IMG
    } else{
        elHeader.innerText = GAME_IMG;
    }
}

// set the level of the game by user's choice
function setLevel(lvl) {
    gLevel = lvl;
    switch(lvl){
        case 4:
            gMine = 2;
            break;
        case 8:
            gMine = 12;
            break;
        case 12:
            gMine = 30;
            break;
    }
    
    resetGame();
}

// resets timer and call upon function init
function resetGame(){
    clearInterval(gInterval);
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = '';
    initGame();
}
