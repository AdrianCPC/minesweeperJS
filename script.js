//Const for mines
const minesWeeper = {
    numMinesTotals: 30,
    numMinesFounds: 0,
    numRows: 15,
    numColumns: 15,
    aFieldMines:  []
}


//Painting board
function createBoard() {
    let board = document.querySelector(".board-element");

    document.querySelector("html").style.setProperty("--num-rows", minesWeeper.numRows);
    document.querySelector("html").style.setProperty("--num-columns", minesWeeper.numColumns);

    //Delete present board and let new board
    while (board.firstChild) {
        board.firstChild.removeEventListener("contextmenu", mark);
        board.firstChild.removeEventListener("click", uncover);
        board.removeChild(board.firstChild);
    }

    for (let r = 0; r < minesWeeper.numRows; r++) {
        for (let c = 0; c < minesWeeper.numColumns; c++) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", "r" + r + "_c" + c);
            newDiv.dataset.row = r;
            newDiv.dataset.column = c;
            newDiv.addEventListener("contextmenu", mark); //Click right with mouse
            newDiv.addEventListener("click", uncover); //Click left with mouse

            board.appendChild(newDiv);
        }
    }
}

//Set up mak and uncover
function mark(myEvent) {
    if (myEvent.type === "contextmenu") {

        //Obtain element that shot event
        let box = myEvent.currentTarget;

        //Stop some events and actions
        console.log(myEvent);
        myEvent.stopPropagation();
        myEvent.preventDefault();

        //Obtain prop rows dataset
        let row = box.dataset.row;
        let column = box.dataset.column;

        if (row >= 0 && column >= 0 && row < minesWeeper.numRows && column < minesWeeper.numColumns) {
            // if marked like a flag
            if (box.classList.contains("icon-flag")) {
                //remove flag
                box.classList.remove("icon-flag");
                //and marked like a doubt
                box.classList.add("icon-doubt");
                //Mines founded is going to be less 1
                minesWeeper.numMinesFounds--;
            } else if (box.classList.contains("icon-doubt")) {
                //remove doubt if this is marked
                box.classList.remove("icon-doubt");
            } else if (box.classList.length == 0) {
                //if not marked so we marked like a flag
                box.classList.add("icon-flag");
                // so adding 1 to the mines founded
                minesWeeper.numMinesFounds++;
                // if minesfounded == minestotals so then solve the board for looking is okay
                if (minesWeeper.numMinesFounds == minesWeeper.numMinesTotals) {
                    minesWeeper.resolveBoard(true);
                }
            }
        }
    }
}
function uncover(event) {}


//Generate field for empty mines with object minesWeeper
function generateFieldEmptyMines() {
    minesWeeper.aFieldMines = new Array(minesWeeper.numRows);
    for (let row = 0; row < minesWeeper.numRows; row++) {
        minesWeeper.aFieldMines[row] = new Array(minesWeeper.numColumns);
    }
}


//Sprinkles random mines on board
function sprinkleMines () {
    let numSprinkleMines = 0;

    
    while (numSprinkleMines < minesWeeper.numMinesTotals) {
        //Random number in the interval [0, numRows-1]
        let row = Math.floor(Math.random() * minesWeeper.numRows);
        //Random number in the interval [0 , numColumns-1]
        let column = Math.floor(Math.random() * minesWeeper.numColumns);

        //There is no bomb in position
        if (minesWeeper.aFieldMines[row][column] != 'B') {

            //Put the bomb
            minesWeeper.aFieldMines[row][column] = 'B';
            // plus 1 for sprinkles mines
            numSprinkleMines++;

        }
    }
};

//Count mines

function countMinesAroundBox (row, column) {
    let numMinesAround = 0;

    //Row before to the after
    for (let zRow = row-1; zRow <= row+1; zRow++){
        //Column before to the after
        for (let zColumn = column-1 ; zColumn <= column+1; zColumn++) {
            //If box fall into the board
            if (zRow>-1 && zRow < minesWeeper.numRows && zColumn>-1 && zColumn < minesWeeper.numColumns) {
                //Looking if in that position, is there a bomb around
                if ( minesWeeper.aFieldMines[zRow][zColumn] == 'B') {
                    //and adding 1 to the numbers of mines there is around in that box
                    numMinesAround++;

                }
            }
        }
    }
    //and save how many mines is there position that
    minesWeeper.aFieldMines[row][column] = numMinesAround;
};


//And now counting mines

function countMines () {
    //Count how many mines are there from each box
    for (let row = 0; row < minesWeeper.numRows; row++) {
        for (let column = 0; column < minesWeeper.numColumns; column++) {
            //Just counting if it is different to the bomb
            if (minesWeeper.aFieldMines[row][column] != 'B') {
                countMinesAroundBox(row, column);
            }
        }
    }
}

//Function init game
function start () {
    minesWeeper.numRows = 10;
    minesWeeper.numColumns = 10;
    createBoard();
    generateFieldEmptyMines();
    sprinkleMines();
    countMines();
}

//Starting board and elements
window.onload = start;

