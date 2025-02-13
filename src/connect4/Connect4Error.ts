/**
 * Enum representing the types of errors that can occur in a Connect 4 game.
 */
export enum Connect4ErrorType {
    /**
     * Indicates that the game has already ended, and no further moves are allowed.
     */
    GAME_OVER,

    /**
     * Indicates that the selected column is already full, and a move cannot be made in it.
     */
    COLUMN_FULL,
}

/**
 * A custom error class for handling Connect 4-specific errors.
 *
 * Extends the built-in `Error` class to include a `type` property that specifies
 * the type of error using the `Connect4ErrorType` enum.
 */
export class Connect4Error extends Error {
    /**
     * The type of error (e.g., GAME_OVER, COLUMN_FULL).
     */
    public readonly type: Connect4ErrorType;

    /**
     * Creates a new instance of `Connect4Error`.
     *
     * @param type - The type of the error, as defined by the `Connect4ErrorType` enum.
     * @param message - An optional human-readable message describing the error.
     */
    constructor(type: Connect4ErrorType, message?: string) {
        super(message);
        this.type = type;
    }
}
