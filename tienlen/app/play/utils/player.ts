import { Move, Player } from '../types/player';
import { Card } from '../types/card';
import { isCardHigher, sortCards } from './card';

/**
 * findLegalMoves - finds all legal moves for the player based on the last played cards
 * @param player - the player whose turn it is
 * @param lastPlayedCards - the last played cards to compare against
 * @returns an array of cards representing a legal move, or an empty array if no legal move is found
 */
const findLegalMoves = (player: Player, lastPlayedCards: Move | null): Move[] => {
    const anyAllowed = lastPlayedCards === null
    const legalMoves: Move[] = [];
    const playerCards = player.cards;
    const n = playerCards.length;

    if (anyAllowed) {
        // if 3S is in player's hand, they must play it first as a valid move
        if (player.cards.some(card => card.rank === '3' && card.suit === 'S')) {
            for (let i = 1; i < n; i++) { // skip 3S
                for (let j = i + 1; j <= n; j++) {
                    const subset = [player.cards[0], ...player.cards.slice(i, j)];
                    if (determineCombinationType(subset) !== 'invalid') {
                        legalMoves.push({ playerId: player.id, cards: subset });
                    }
                }
            }
            if (legalMoves.length === 0) {
                legalMoves.push({ playerId: player.id, cards: [{ rank: '3', suit: 'S' }] });
            }
            return legalMoves;
        }
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j <= n; j++) {
                const subset = player.cards.slice(i, j);
                if (determineCombinationType(subset) !== 'invalid') {
                    legalMoves.push({ playerId: player.id, cards: subset });
                }
            }
        }
        return legalMoves;
    } else {
        const lastPlayerCardsType = determineCombinationType(lastPlayedCards.cards);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j <= n; j++) {
                const subset = playerCards.slice(i, j);
                if (determineCombinationType(subset) === lastPlayerCardsType && subset.length === lastPlayedCards.cards.length) {
                    const canBeat = isCardHigher(subset[subset.length - 1], lastPlayedCards.cards[lastPlayedCards.cards.length - 1]);
                    if (canBeat) {
                        legalMoves.push({ playerId: player.id, cards: subset });
                    }
                }
            }
        }    
    }

    return legalMoves;
}

/**
 * determineCombinationType - determines the type of card combination
 * @param cards - array of cards in format 'rank-suit' (e.g., ['3-hearts', '5-spades'])
 * @returns combination type as a string
 */
const determineCombinationType = (cards: Card[]): 'single' | 'pair' | 'triple' | 'fourofakind' | 'straight' | 'cutter' | 'invalid' => {
    if (cards.length === 1) return 'single';
    if (cards.length === 2 && cards[0].rank === cards[1].rank) return 'pair';
    if (cards.length === 3 && cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank) return 'triple';
    if (cards.length === 4 && cards.every(card => card.rank === cards[0].rank)) return 'fourofakind';
    if (cards.length >= 3) {
        // check for straight - 2 is not allowed in straights
        if (cards.some(card => card.rank === '2')) return 'invalid';
        const rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
        const sortedCards = sortCards(cards);
        let isStraight = true;
        for (let i = 1; i < sortedCards.length; i++) {
            if (rankOrder.indexOf(sortedCards[i].rank) !== rankOrder.indexOf(sortedCards[i - 1].rank) + 1) {
                isStraight = false;
                break;
            }
        }
        if (isStraight) return 'straight';
    }

    return 'invalid'
}

/**
 * moveIsLegal - checks if the played cards form a legal move against the last played move
 * @param playedCards - array of cards the player wants to play
 * @param lastPlayedMove - the last played move to compare against
 * @returns true if the move is legal, false otherwise
 */
const moveIsLegal = (playedCards: Card[], lastPlayedMove: Move | null): boolean => {
    if (!lastPlayedMove) {
        return determineCombinationType(playedCards) !== 'invalid';
    }
    const playedType = determineCombinationType(playedCards);
    const lastType = determineCombinationType(lastPlayedMove.cards);
    if (playedType !== lastType || playedCards.length !== lastPlayedMove.cards.length) return false; // must be the same type

    // compare the highest cards of each move
    const playedHighest = playedCards.reduce((highest, card) => isCardHigher(card, highest) ? card : highest, playedCards[0]);
    const lastHighest = lastPlayedMove.cards.reduce((highest, card) => isCardHigher(card, highest) ? card : highest, lastPlayedMove.cards[0]);
    return isCardHigher(playedHighest, lastHighest);
}

export { findLegalMoves, determineCombinationType, moveIsLegal };