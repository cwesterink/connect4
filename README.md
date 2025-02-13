# Connect 4 Game Runner

This project implements a Connect 4 game runner, allowing two players to take turns dropping tokens into a 7x6 grid until one player wins or the game results in a draw.

## Usage

### Importing the Game

```typescript
import { Connect4 } from "./connect4";
```

### Initializing the Game

```typescript
const game = new Connect4();
```
### Playing a Move

Players take turns dropping tokens into columns:

```typescript
try {
    game.playColumn(Player.One, 3); // Player One drops a token in column 3
    game.playColumn(Player.Two, 4); // Player Two drops a token in column 4
} catch (error) {
    console.error(error.message);
}
```

### Getting the Board State

Retrieve the current state of the board:

```typescript
console.log(game.board());
```

### Checking the Game State

```typescript
const state = game.state();
console.log(`Current Turn: ${state.playerTurn}`);
console.log(`Game Status: ${state.gameStatus}`);
if (state.winner) {
    console.log(`Winner: ${state.winner}`);
}
```

### Resetting the Game

To restart the game:

```typescript
game.reset();
```

## Error Handling

The game throws errors in the following cases:

- Attempting to play in a full column.
- Playing out of turn.
- Making a move after the game has ended.

Example:

```typescript
try {
    game.playColumn(Player.One, 7); // Invalid column index
} catch (error) {
    console.error(error.message);
}
```

## Winning Conditions

A player wins if they connect 4 tokens in:
- A horizontal row
- A vertical column
- A diagonal (ascending or descending)

The game ends in a draw if all columns are full with no winner.


