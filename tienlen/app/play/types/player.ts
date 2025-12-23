import { Card } from './card';

interface Player {
    id: string;
    name: string;
    cards: Card[];
    isActive: boolean;
    isPlayer: boolean;
    isFinished: boolean;
    hasSkipped: boolean;
}

interface Move {
    playerId: string;
    cards: Card[];
}

export type { Player, Move };