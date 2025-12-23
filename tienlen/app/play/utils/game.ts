import { Move, Player } from '../types/player';
import { sortCards, shuffleDeck } from './card';
import { findLegalMoves, moveIsLegal } from './player';
import { Card } from '../types/card';

export class Game {
    private players: Player[];
    private currentPlayerIndex: number;
    private gameState: 'waiting' | 'playing' | 'finished';
    private finishedCounter: number = 0;
    public lastPlayedCards: Move | null = null;
    public turn = 0;

    constructor(players: string[]) {
        this.finishedCounter = 0;
        this.turn = 0;
        this.players = players.map((name, index) => ({
            id: `player-${index + 1}`,
            name,
            cards: [],
            isActive: false,
            isPlayer: name === 'You',
            isFinished: false,
            hasSkipped: false,
        }));
        
        this.currentPlayerIndex = 0;
        this.gameState = 'waiting';
    }

    public startGame() {
        this.gameState = 'playing';
        this.lastPlayedCards = null;
        const deck = shuffleDeck();
        this.players = this.players.map((player, index) => ({
            id: `player-${index + 1}`,
            name: player.name,
            cards: [],
            isActive: false,
            isPlayer: player.isPlayer,
            isFinished: false,
            hasSkipped: false,
        }));
        this.players.forEach(player => {
            player.cards = sortCards(deck.splice(0, 13));
            if (player.cards.some(card => card.rank === '3' && card.suit === 'S')) { // '3-S' is the starting card
                this.currentPlayerIndex = this.players.indexOf(player);
            }
        });
        this.turn = 0;
        this.finishedCounter = 0;
    }

    public playTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (currentPlayer.isPlayer) {
            // ignore and wait for player to make action
        } else {
            if (currentPlayer.hasSkipped) {
                console.log(`${currentPlayer.name} has already skipped this round.`);
                this.nextTurn();
                return;
            }
            // Simple AI logic for non-player characters
            const moves: Move[] = findLegalMoves(currentPlayer, this.lastPlayedCards);
            if (moves.length < 1) {
                currentPlayer.hasSkipped = true;
            } else {
                // pick random legal move
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                this.lastPlayedCards = randomMove;
                currentPlayer.cards = currentPlayer.cards.filter(card => !randomMove.cards.some(c => c.rank === card.rank && c.suit === card.suit));
            }
            this.nextTurn();
        }
    }

    public playerMove(cards: Card[]) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        if (!currentPlayer.isPlayer) {
            throw new Error("It's not the player's turn.");
        }
        if (this.turn === 0 && cards.length === 0) {
            throw new Error("You must play a move on the first turn.");
        }
        if (cards.length === 0) {
            // player passes
            this.nextTurn();
            currentPlayer.hasSkipped = true;
            return;
        }
        if (currentPlayer.hasSkipped) {
            throw new Error("You have already skipped this round.");
        }
        if (!this.lastPlayedCards && this.turn === 0) {
            // first move must contain 3S
            const has3S = cards.some(card => card.rank === '3' && card.suit === 'S');
            if (!has3S) {
                throw new Error("First move must contain the 3 of Spades.");
            }
        }
        if (moveIsLegal(cards, this.lastPlayedCards)) {
            this.lastPlayedCards = { playerId: currentPlayer.id, cards };
            currentPlayer.cards = currentPlayer.cards.filter(card => !cards.some(c => c.rank === card.rank && c.suit === card.suit));
        } else {
            throw new Error("Invalid move.");
        }
        this.nextTurn();
    }

    public nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.turn += 1;
        // if it's player turn again and the last played cards were by the player, reset lastPlayedCards to null
        if (this.lastPlayedCards?.playerId === this.players[this.currentPlayerIndex].id) {
            this.lastPlayedCards = null;
            this.players.forEach(player => player.hasSkipped = false);
        }
        if (this.players[this.currentPlayerIndex].hasSkipped) {
            this.nextTurn();
            return;
        }
        if (this.players[this.currentPlayerIndex].cards.length === 0) {
            if (!this.players[this.currentPlayerIndex].isFinished) {
                this.players[this.currentPlayerIndex].isFinished = true;
                this.finishedCounter += 1;
            }
            if (this.finishedCounter >= this.players.length - 1) {
                this.gameState = 'finished';
                console.log("Game Over");
                return;
            }
            console.log("Game Over");
            this.nextTurn();
        }
        if (this.finishedCounter >= this.players.length - 1) {
            console.log("Game Over");
            this.gameState = 'finished';
            return;
        }
    }

    public getGameData() {
        return {
            players: this.players,
            turn: this.turn,
            currentPlayerId: this.players[this.currentPlayerIndex].id,
            lastPlayedCards: this.lastPlayedCards,
            gameState: this.gameState
        };
    }
}

