import {NUM_COLUMNS, NUM_ROWS} from "./constants";
import {Cell, Connect4GameState, GameStatus, Grid, Player} from "./types";
import {Connect4Game} from "./Connect4Game";
import {Connect4Error, Connect4ErrorType} from "./Connect4Error";

/**
 * Implementation of Connect4Game interface
 */
export class Connect4 implements Connect4Game {
    private currentGrid: Grid;
    private playerTurn: Player;
    private gameStatus: GameStatus;
    private winner: Player | null;
    private nextRow: number[];

    constructor() {
        this.currentGrid = this.newGrid();
        this.playerTurn = Player.One;
        this.gameStatus = GameStatus.InProgress;
        this.winner = null;
        this.nextRow = new Array(NUM_COLUMNS).fill(NUM_ROWS-1);
    }


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
    public playColumn(columnIdx: number, player?: Player): void {
        this.validatePlay(columnIdx);
        const rowIdx = this.nextRow[columnIdx];

        const playing = player ?? this.playerTurn;
        this.currentGrid[rowIdx][columnIdx] = playing;

        this.nextRow[columnIdx]--;
        this.playerTurn = playing === Player.One ? Player.Two : Player.One;

        if (this.checkWin(rowIdx, columnIdx, playing)) {
            this.winner = playing;
            this.gameStatus = GameStatus.Win;
        } else if (this.boardFull()) {
            this.gameStatus = GameStatus.Draw;
        }
    }

    /**
     * Resets the game state to its initial configuration.
     * - Clears the board.
     * - Resets the turn to Player.One.
     * - Sets the game status to InProgress.
     * - Resets tracking of available row positions.
     */
    public reset(): void {
        this.currentGrid = this.newGrid();
        this.playerTurn = Player.One;
        this.gameStatus = GameStatus.InProgress;
        this.winner = null;
        this.nextRow = new Array(NUM_COLUMNS).fill(NUM_ROWS-1);
    }

    /**
     * Returns the current the state of the connect4 grid, as a 2D array. The top left corner
     * of the connect4 is represented by grid[0][0] and the top right as grid[0][6], etc.
     * The value Player.One and Player.Two at grid[x][y] denotes Player 1 or 2's token
     * occupying row x and column y on the connect4 grid.
     *
     * @returns {Cell[][]} A 2D array representing the game board where each cell contains
     * `null`, `Player.One`, or `Player.Two`.
     */
    public grid(): Grid {
        return structuredClone(this.currentGrid);
    }

    /**
     * Returns the current game state, including which player's turn it is, the game status, and the winner (if any).
     *
     * @returns {Connect4GameState} An object containing:
     *  - `playerTurn`: The player whose turn it is.
     *  - `gameStatus`: The current status of the game (InProgress, Win, or Draw).
     *  - `winner`: The player who won (or `null` if there is no winner yet).
     */
    public gameState(): Connect4GameState {
        return {
            playerTurn: this.playerTurn,
            gameStatus: this.gameStatus,
            winner: this.winner
        }
    }

    private newGrid() {
        const grid = new Array(NUM_ROWS);
        for (let i = 0; i < NUM_ROWS; i++) {
            grid[i] = new Array(NUM_COLUMNS).fill(null);
        }
        return grid;

    }

    private validatePlay(column: number) {
        if (this.gameStatus !== GameStatus.InProgress) {
            throw new Connect4Error(Connect4ErrorType.GAME_OVER, "Game over");
        }

        if (this.nextRow[column] < 0) {
            throw new Connect4Error(Connect4ErrorType.COLUMN_FULL, "Column full");
        }
    }

    private getColumn(columnIdx: number): Cell[] {
        return this.currentGrid.map(row => row[columnIdx]);
    }

    private boardFull(): boolean {
        return this.nextRow.every(row => row < 0);
    }

    private checkHorizontalWin(row: number, column: number, player: Player) {
        const startCol = Math.max(0, column - 3);
        const endCol = Math.min(NUM_COLUMNS - 1, column + 4);
        return this.streak(this.currentGrid[row].slice(startCol, endCol), player) >= 4;
    }

    private checkVerticalWin(rowIdx: number, columnIdx: number, player: Player) {
        const startRow = Math.max(0, rowIdx - 3);
        const endRow = Math.min(NUM_ROWS, rowIdx + 4);

        const col = this.getColumn(columnIdx);
        return this.streak(col.slice(startRow, endRow), player) >= 4;
    }

    private checkDescendingDiagonalWin(row: number, column: number, player: Player) {
        const distance = Math.min(column, row, 3);
        const diagonalStartCol = column - distance;
        const diagonalStartRow = row - distance;
        const diagonals: Cell[] = [];

        let i = diagonalStartRow;
        let j = diagonalStartCol;

        while (i < NUM_ROWS && j < NUM_COLUMNS) {
            diagonals.push(this.currentGrid[i][j]);
            i++;
            j++;
        }

        return this.streak(diagonals, player) >= 4;
    }

    private checkAscendingDiagonalWin(row: number, column: number, player: Player) {
        const distance = Math.min(column, NUM_ROWS - 1 - row, 3);
        const diagonalStartCol = column - distance;
        const diagonalStartRow = row + distance;
        const diagonals: Cell[] = [];

        let i = diagonalStartRow;
        let j = diagonalStartCol;

        while (i >= 0 && j < NUM_COLUMNS) {
            diagonals.push(this.currentGrid[i][j]);
            i--;
            j++;
        }

        return this.streak(diagonals, player) >= 4;
    }

    private streak(cells: Cell[], player: Player) {
        let maxStreak = 0;
        let currentStreak = 0;
        for (const cell of cells) {
            if (cell == player) {
                currentStreak++;
            } else {
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
                currentStreak = 0;
            }
        }
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
        return maxStreak;
    }

    private checkWin(row: number, column: number, player: Player): boolean {
        return this.checkHorizontalWin(row, column, player) ||
            this.checkVerticalWin(row, column, player) ||
            this.checkDescendingDiagonalWin(row, column, player) ||
            this.checkAscendingDiagonalWin(row, column, player);
    }
}