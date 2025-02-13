import {Connect4GameState, Grid, Player} from "./types";

export interface Connect4Game {
    /**
     * Drops in token representing one of the two Players into the lowest available spot in the
     * provided column of the connect4 game grid. The game controller has a notion of the
     * next Player's turn however the next player can be optionally overridden.
     * If an error is thrown the game state remains the same.
     *
     * @param {number} columnIdx - The column index (0 to NUM_COLUMNS - 1) where the player
     * wants to drop a piece.
     * @param {Player} player - (Optionally) The player making the move (Player.One or Player.Two).
     *
     * @throws {Connect4Error} If the game is over {ErrorType == GAME_OVER}
     * @throws {Connect4Error} If the column is full {ErrorType == COLUMN_FULL}
     */
    playColumn(columnIdx: number, player?: Player): void;

    /**
     * Returns the current the state of the connect4 grid, as a 2D array. The top left corner
     * of the connect4 is represented by grid[0][0] and the top right as grid[0][6], etc.
     * The value Player.One and Player.Two at grid[x][y] denotes Player 1 or 2's token
     * occupying row x and column y on the connect4 grid.
     *
     * @returns {Cell[][]} A 2D array representing the game board where each cell contains
     * `null`, `Player.One`, or `Player.Two`.
     */
    grid(): Grid;

    /**
     * Returns the current game state, including which player's turn it is, the game status, and
     * the winner (if any).
     *
     * @returns {Connect4GameState} An object containing:
     *  - `playerTurn`: The player whose turn it is.
     *  - `gameStatus`: The current status of the game (InProgress, Win, or Draw).
     *  - `winner`: The player who won (or `null` if there is no winner yet).
     */
    gameState(): Connect4GameState;

    /**
     * Resets the game state to its initial configuration.
     * - Clears the board.
     * - Resets the turn to Player.One.
     * - Sets the game status to InProgress.
     * - Resets tracking of available row positions.
     */
    reset(): void;
}
