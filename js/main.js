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
var gHints;
var gSafes;
var gIsHint;
var gIsSafe;




// initialize all global variables and board
function initGame() {
    gGame = setGame();
    setHelp();
    setLives(gLives);
    setHints(gHints);
    setSafes(gSafes);
    gMarked = gMine;
    gMinesCount = gMine;
    changeSubtexts();
    gBoard = buildBoard(gLevel, gMine);
    renderBoard(gBoard);
}

// renders board on page as a table with cells
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < gLevel; i++) {
        strHTML += ('<tr>');
        for (var j = 0; j < gLevel; j++) {
            var currCell = 'cell-' + i + '-' + j;
            strHTML += (`<td class= "cell ${currCell} hidden"  oncontextmenu="cellMarked(this,event, ${i},${j})" onclick="cellClicked(this,${i}, ${j})"></td>`);
        }
        strHTML += ('</tr>');
    }
    // console.log(board)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


// when left click - checks what kind of cell and acts accordingly
// start time and setting mines on board upon first click(left/right)
// keeping every user's move. 
// checks each time if GAMEOVER/GAMEWON
function cellClicked(elCell, i, j) {
    if (gGame.isGameOver === true) return;
    var cellIdx = gBoard[i][j];
    if (gFirstMove === 0) {
        setTimer();
        getMineCells(gBoard, gMine, cellIdx);
        gFirstMove++;
    }
    if (elCell.isMarked === true || elCell.isShown === true) return;
    if (gIsHint === true) return showHint(i, j);
    cellIdx.isShown = true;
    gGame.boardSteps.push(keepBoardSteps(gBoard));
    if (gBoard[i][j].isMine === true) {
        gLives--;
        setLives(gLives);
        gMinesCount--;
        changeSubtexts();
        elCell.classList.remove('hidden');
        elCell.style.backgroundColor = 'rgb(214, 66, 66)';
        elCell.innerText = MINE_IMG;
        if (gLives === 0) {
            gGame.isGameOver = true;
        }
        return checkGameOver();
    }
    var negCells = setMinesNegsCount(gBoard, i, j);
    if (negCells === 0) {
        elCell.classList.remove('hidden');
        gGame.shownCount++;
        revealNegs(i, j);
    } else {
        elCell.isShown = true;
        elCell.classList.remove('hidden');
        elCell.innerText = negCells;
        gGame.shownCount++;
    }
    checkVictory();

}

// activating hint before user's clicks on cell
function hint(ev) {
    if (gGame.isGameOver === true || gFirstMove === 0) return;
    if (gHints === 0 || gIsHint === true) return;
    if (gIsSafe === true);
    gHints--;
    gIsHint = true;
}

// activating hintReveal - which shows for a second all the neighbors around
// the chosen cell
function showHint(rowIdx, colIdx) {
    setHints(gHints);
    hintRevealNegs(true, rowIdx, colIdx);
    setTimeout(function () {
        gIsHint = false;
        hintRevealNegs(false, rowIdx, colIdx);
    }, 500);
}

// when right click - marks cell believed to be a mine
// start time and setting mines on board upon first click(left/right) checks each time if GAMEOVER/GAMEWON
function cellMarked(elCell, ev, i, j) {
    ev.preventDefault();
    if (gGame.isGameOver !== true) {
        var cellIdx = gBoard[i][j];
        if (gFirstMove === 0) {
            setTimer();
            getMineCells(gBoard, gMine, cellIdx);
            gFirstMove++;
        }
        if (elCell.isMarked === false && elCell.isShown === false) return;
        if (elCell.isMarked === true) {
            elCell.isMarked = false;
            elCell.classList.remove('marked');
            elCell.classList.add('hidden');
            elCell.innerText = '';
            gMinesCount++;
            gGame.markedCount--;
            changeSubtexts();
        } else if (gMinesCount !== 0) {
            elCell.isMarked = true;
            elCell.classList.remove('hidden');
            elCell.classList.add('marked');
            elCell.innerText = FLAG_IMG;
            gMinesCount--;
            gGame.markedCount++;
            changeSubtexts();
        }
    }
    checkVictory();
}


// changes h3 head to either win/reset
function changeSubtexts() {
    var elHeader = document.querySelector('h3');
    if (gMinesCount > -1) {
        var elMinesLeft = document.querySelector('.mines-left span');
        elMinesLeft.innerText = gMinesCount;
    }
    if (gGame.isGameOver === true) {
        elHeader.innerText = WINNER_IMG
    } else {
        elHeader.innerText = GAME_IMG;
    }
}

// set the level of the game by user's choice
function setLevel(lvl) {
    gLevel = lvl;
    switch (lvl) {
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

function setLives(gLives) {
    var elLive = document.querySelector('.lives span')
    switch (gLives) {
        case 3:
            elLive.innerText = '💗💗💗';
            break;
        case 2:
            elLive.innerText = '💗💗🤍';
            break;
        case 1:
            elLive.innerText = '💗🤍🤍';
            break;
        case 0:
            elLive.innerText = '🤍🤍🤍';
            break;
    }
}

function setHints(gHints) {
    var elHint = document.querySelector('.hints span')
    switch (gHints) {
        case 3:
            elHint.innerText = '💡💡💡';
            break;
        case 2:
            elHint.innerText = '💡💡❌';
            break;
        case 1:
            elHint.innerText = '💡❌❌';
            break;
        case 0:
            elHint.innerText = '❌❌❌';
            break;
    }
}

function setSafes(gSafes) {
    var elSafe = document.querySelector('.safes span')
    switch (gSafes) {
        case 3:
            elSafe.innerText = '☝☝☝';
            break;
        case 2:
            elSafe.innerText = '☝☝✊';
            break;
        case 1:
            elSafe.innerText = '☝✊✊';
            break;
        case 0:
            elSafe.innerText = '✊✊✊';
            break;
    }
}


// resets timer and call upon function init
function resetGame() {
    clearInterval(gInterval);
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = '';
    initGame();
}
