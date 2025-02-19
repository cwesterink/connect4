import * as readline from 'readline';
import {Connect4, Connect4Game, GameStatus, Player, Connect4Error, Connect4ErrorType} from "./connect4";

class Connect4CliClient {

    private readonly game: Connect4Game;
    private readonly interface: readline.Interface;

    constructor(game: Connect4Game) {
        this.game = game;
        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public startGame() {
        console.log("Welcome to Connect 4!");
        this.printBoard();
        this.promptMove();
    }

    private printBoard() {
        const board = this.game.grid();
        console.log("\n 0  1  2  3  4  5  6 ");
        console.log("--------------------");
        board.forEach(row => {
            console.log(row.join('  '));
        });
        console.log("--------------------\n");
    }

    private promptMove() {
        const state = this.game.gameState();
        if (state.gameStatus !== GameStatus.InProgress) {
            console.log(state.gameStatus === GameStatus.Win ? `Player ${state.winner} wins! 🎉` : "It's a draw! 🤝");
            this.interface.question("Play again? (y/n): ", (answer) => {
                if (answer.toLowerCase() === 'y') {
                    this.game.reset();
                    this.printBoard();
                    this.promptMove();
                } else {
                    this.interface.close();
                }
            });
            return;
        }

        this.interface.question(`Player ${state.playerTurn} - Choose a column (0-6): `, (input) => {
            const column = parseInt(input, 10);
            if (isNaN(column) || column < 0 || column > 6) {
                console.log("Invalid input. Please enter a number between 0 and 6.");
            } else {
                try {
                    this.game.playColumn(column);
                } catch (error) {
                    if (error instanceof Connect4Error) {
                        console.log("error");
                        if (error.type == Connect4ErrorType.COLUMN_FULL) {
                            console.error(error.message);
                        } else if (error.type == Connect4ErrorType.GAME_OVER) {
                            console.error(error.message);
                        }
                    }
                }
            }
            this.printBoard();
            this.promptMove();
        });
    }




}

const game = new Connect4();
const cli = new Connect4CliClient(game);
cli.startGame();

