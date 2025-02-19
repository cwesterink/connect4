/**
 * Represents a single cell in the Connect4 grid.
 *
 * A cell can either be occupied by a player (`PlayerOne` or `PlayerTwo`) or be empty (`Empty`).
 */
export enum Cell {
    /**
     * Represents Cell occupied by player 1.
     */
    PlayerOne= "X",

    /**
     * Represents Cell occupied by player 2.
     */
    PlayerTwo =  "O",

    /**
     * Represents unoccupied/empty Cell
     */
    Empty = " "
}

/**
 * Represents the Connect 4 game grid.
 *
 * The grid is a 2D array where each element is a `Cell`. Rows are represented as arrays of cells.
 */
export type Grid = Cell[][];

/**
 * Represents the current state of the Connect 4 game.
 */
export type Connect4GameState = {
    /**
     * The player whose turn it is to play.
     */
    playerTurn: Player;

    /**
     * The winner of the game, if there is one. If the game is still in progress or ends in a draw,
     * this will be `null`.
     */
    winner: Player | null;

    /**
     * The current status of the game (e.g., ongoing, win, or draw).
     */
    gameStatus: GameStatus;
};

/**
 * Enum representing the players in the Connect 4 game.
 */
export enum Player {
    /**
     * Represents Player One.
     */
    One = 'p1',

    /**
     * Represents Player Two.
     */
    Two = 'p2'
}

/**
 * Enum representing the possible statuses of a Connect 4 game.
 */
export enum GameStatus {
    /**
     * Indicates that a player has won the game.
     */
    Win = 'win',

    /**
     * Indicates that the game has ended in a draw (no winner).
     */
    Draw = 'draw',

    /**
     * Indicates that the game is still in progress.
     */
    InProgress = 'inProgress',
}
