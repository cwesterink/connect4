import {NUM_COLUMNS, NUM_ROWS} from "./constants";

class Connect4 implements Connect4Game {
    private grid: Grid;
    private playerTurn: Player;
    private gameStatus: GameStatus;
    private winner: Player | null;

    private readonly nextRow: number[];

    constructor() {
        this.grid = this.newGrid();
        this.playerTurn = Player.One;
        this.gameStatus = GameStatus.InProgress;
        this.winner = null;
        this.nextRow = new Array(NUM_COLUMNS).fill(NUM_COLUMNS-1);
    }

    private newGrid() {
        const grid: Grid = new Array(NUM_ROWS);
        grid.map(() => new Array(NUM_COLUMNS).fill(null));
        return grid;
    }

    private validatePlay(player: Player, column: number) {
        if (this.gameStatus !== GameStatus.InProgress) {
            throw new Error("Game over");
        }

        if (player !== this.playerTurn) {
            throw new Error("Not player turn");
        }

        if (this.nextRow[column] < 0) {
            throw new Error("Column full");
        }
    }

    private checkHorizontalWin(row: number, column: number, player: Player) {
        const startCol = Math.max(0, column - 3);
        const endCol = Math.min(NUM_COLUMNS - 1, column + 4);
        return this.streak(this.grid[row].slice(startCol, endCol), player) >= 4;
    }

    private checkVerticalWin(row: number, column: number, player: Player) {
        const startRow = Math.min(0, row - 3);
        const endRow = Math.max(NUM_ROWS - 1, column + 4);

        const col = this.grid.map(row => row[column]);
        return this.streak(col.slice(startRow, endRow), player) >= 4;
    }

    private checkDescendingDiagonalWin(row: number, column: number, player: Player) {
        const distance = Math.min(column, row, 3);
        const diagonalStartCol = column - distance;
        const diagonalStartRow = row - distance;
        const diagonals: Cell[] = [];

        let i = diagonalStartRow;
        let j = diagonalStartCol;

        while (i < NUM_COLUMNS && j < NUM_COLUMNS) {
            diagonals.push(this.grid[i][j]);
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

        while (i > 0 && j < NUM_COLUMNS) {
            diagonals.push(this.grid[i][j]);
            i--;
            j++;
        }

        return this.streak(diagonals, player) >= 4;
    }

    private checkWin(row: number, column: number, player: Player): boolean {
        return this.checkHorizontalWin(row, column, player) ||
            this.checkVerticalWin(row, column, player) ||
            this.checkDescendingDiagonalWin(row, column, player) ||
            this.checkAscendingDiagonalWin(row, column, player);

        // let i = row - 3;
        // let j = column - 3;
        // let iEnd = row + 3;
        // let jEnd = column + 3
        // const diagonalCells: Cell[] = [];
        // while (i <= iEnd || j <= jEnd) {
        //     if ((0 >= i && i <= NUM_ROWS) && (0 >= j && j <= NUM_ROWS)) {
        //         diagonalCells.push(this.grid[i][j]);
        //     }
        //     i++
        //     j++
        // }
        // const downwardDiagonalWin = this.streak(diagonalCells, player) >= 4
        //
        //
        // for (let i = startRow; i <= endRow; i++) {}
    }

    private boardFull() {
        return this.nextRow.every(row => row < 0);
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

    public playColumn(player: Player, column: number): void {
        this.validatePlay(player, column);

        const row = this.nextRow[column];
        this.grid[row][column] = player;

        this.nextRow[column]--;
        this.playerTurn = this.playerTurn === Player.One ? Player.Two : Player.One;

        if (this.checkWin(row, column, player)) {
            this.winner = player;
            this.gameStatus = GameStatus.Win;
        }

        if (this.boardFull()) {
            this.gameStatus = GameStatus.Draw;
        }
    }

    public reset(): void {
        this.grid = this.newGrid();
        this.playerTurn = Player.One;
    }

    public state(): Connect4GameState {
        return {
            grid: this.grid.map(row => row.map(cell => cell)),
            playerTurn: this.playerTurn,
            gameStatus: this.gameStatus,
            winner: this.winner
        }
    }
}