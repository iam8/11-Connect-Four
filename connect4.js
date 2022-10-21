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

let isGameActive = true;

/** makeBoard: create the in-JS board structure.
 NOTE: The JS board does NOT include the topmost (header) row that will be visible in-game (HTML).
*/
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
        headCell.className = "player-blue";
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

/** findSpotForCol: for a given column x, return the topmost empty y (null if entire column is filled) */
function findSpotForCol(x) {

    // If the very first slot (row y = 0) is not empty, the entire column is filled
    if (board[0][x] !== null) {
        return null;
    }

    // Traverse the rest of column x (starting at row y = 1) until a non-empty slot is reached
    let y = 1;
    while (y < HEIGHT && board[y][x] === null) {
        y++;
    }

    return y - 1;
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

/** endGame: announce the end of the game with an alert popup. */
function endGame(msg) {

    alert(msg);
}

/** handleClick: handle clicks on the topmost table row (used for playing a piece) */
function handleClick(evt) {

    // If game has ended, ignore further clicks
    if (!isGameActive) {
        return;
    }

    // Get x from the ID of the clicked cell
    const x = +evt.target.id;

    // Get the next empty spot in the current column (if there are none, ignore the click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // Place piece on board and add it to the HTML table
    placeInTable(y, x);

    // Update the JS in-memory board to reflect that the slot at (y, x) has been filled by a piece
    // corresponding to the current player
    board[y][x] = currPlayer;

    // Check for a win
    if (checkForWin()) {
        isGameActive = false;
        return endGame(`Player ${currPlayer} won!`);
    }

    // Check if the entire board is filled with no wins (tie)
    const isBoardFilled = board.every((rowArr) => {
        return rowArr.every((rowElement) => {
            return rowElement !== null;
        })
    })

    // If the entire board is filled, call endGame
    if (isBoardFilled) {
        isGameActive = false;
        return endGame("The game ended in a tie!");
    }

    // Switch players (1 <=> 2)
    currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;

    // Switch the class of the cells in the HTML column header row to reflect the new player color
    const columnTopCells = document.querySelectorAll("#column-top td");
    for (let cell of columnTopCells) {
        currPlayer === 1 ? cell.className = "player-blue" : cell.className = "player-red";
    }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {

    /** _win: check four adjoining cells (horizontal, vertical, and diagonal) to see if they have been filled by the current player.
     * - cells: array of four (y, x) cells
     * - Return true if all four cells are legal coordinates and all match currPlayer
    */
    function _win(cells) {

        return cells.every(
        ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
        );
  }

    // Iterate over each cell of the gameboard
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {

            /** For each board cell, build an array holding the coordinates of:
             * 1) 4 cells to the right
             * 2) 4 cells upwards
             * 3) 4 cells diagonally down right
             * 4) 4 cells diagonally down left
             * The first set of coordinates is always the coordinates of the current cell.
            */
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

            // Check if any of the above sets of four cells constitutes a 'win' (all cells in a set are filled by a single player)
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard(); // Create the JS game board
makeHtmlBoard(); // Create the HTML game board
