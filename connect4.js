// Ioana Alex Mititean
// 10/15/22
// Unit 11 - Connect Four Project

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a column until a player
 * gets four-in-a-row (horizontally, vertically, or diagonally) or until the board fills (tie).
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // Denotes the active player: 1 or 2
const board = []; // An array of rows, where each row is array of cells (board[y][x])

/** makeBoard: create the in-JS board structure. */
function makeBoard() {

    for (let i = 0; i < HEIGHT; i++) {

        // Construct a subarray (which represents a board row) and fill it with 'null' values
        const initRow = [];
        for (let j = 0; j < WIDTH; j++) {
            initRow.push(null);
        }

        // Add the row to the game board
        board.push(initRow);
    }
}

/** makeHtmlBoard: make the HTML table and the row of column tops. */
function makeHtmlBoard() {

    // Get the HTML board (a table with an ID of 'board')
    const htmlBoard = document.querySelector("#board");

    // Create a clickable table row for the top of the game board and add a click handler
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    // Create data table cells for the top table row and assign an ID to each that corresponds to the cell's column number
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }

    // Add the top table row to the board
    htmlBoard.append(top);

    // Create and append table row elements to the game board
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");

        // Create data table cells for this row and set an ID for each
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }

        // Add this row to the board
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
    // TODO: write the real version of this, rather than always returning 0
    return 0;
}

/** placeInTable: update the DOM to place a piece into the HTML table of board. */
function placeInTable(y, x) {

    // Create a new div that represents the piece that was just played
    const playedPiece = document.createElement("div");
    playedPiece.classList.add("piece", `p${currPlayer}`);

    // Retrieve the correct td element and place this new div inside it
    const targetTd = document.getElementById(`${y}-${x}`);
    targetTd.append(playedPiece);
}

/** endGame: announce game end */
function endGame(msg) {
    // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame

    // switch players
    // TODO: switch currPlayer 1 <-> 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
        ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
        );
  }

  // TODO: read and understand this code. Add comments to help you.
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();
