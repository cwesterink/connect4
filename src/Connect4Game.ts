interface Connect4Game {

    state(): Connect4GameState
    playColumn(player: Player, column: number): void
    reset(): void
}

type Cell = Player | null;
type Grid = Cell[][];

type Connect4GameState = {
    grid: Grid;
    playerTurn: Player;
    winner: Player | null;
    gameStatus: GameStatus;
}

enum Player {
    One = 'p1',
    Two = 'p2'
}

enum GameStatus {
    Win = 'win',
    Draw = 'draw',
    InProgress = 'inProgress',
}