import { Card } from "../types/card";

const RANK_ORDER = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
const SUIT_ORDER = ['S', 'C', 'D', 'H'];

/**
 * isCardHigher
 * @param cardA - first card in format 'rank-suit' (e.g., '3-hearts')
 * @param cardB - second card in format 'rank-suit' (e.g., '5-spades')
 * @returns true if cardA is higher than cardB according to Tien Len rules
 */
const isCardHigher = (cardA: Card, cardB: Card): boolean => {
    const { rank: rankA, suit: suitA } = cardA;
    const { rank: rankB, suit: suitB } = cardB;
    if (RANK_ORDER.indexOf(rankA) === RANK_ORDER.indexOf(rankB)) {
        return SUIT_ORDER.indexOf(suitA) > SUIT_ORDER.indexOf(suitB);
    }
    return RANK_ORDER.indexOf(rankA) > RANK_ORDER.indexOf(rankB);
}

/**
 * sortCards
 * @param cards - array of cards in format 'rank-suit' (e.g., ['3-hearts', '5-spades'])
 * @returns sorted array of cards from lowest to highest according to Tien Len rules
 */
const sortCards = (cards: Card[]): Card[] => {
    return cards.sort((a, b) => {
        const { rank: rankA, suit: suitA } = a;
        const { rank: rankB, suit: suitB } = b;
        if (RANK_ORDER.indexOf(rankA) === RANK_ORDER.indexOf(rankB)) {
            return SUIT_ORDER.indexOf(suitA) - SUIT_ORDER.indexOf(suitB);
        }
        return RANK_ORDER.indexOf(rankA) - RANK_ORDER.indexOf(rankB);
    });
}

/**
 * shuffleDeck
 * @returns array of 52 random cards in format 'rank-suit' (e.g., ['3-hearts', '5-spades'])
*/
const shuffleDeck = (): Card[] => {
    const suits = ['H', 'D', 'C', 'S'] as const;
    const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'] as const;
    const deck: Card[] = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({ rank, suit });
        });
    });

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // Deal 13 cards
    return deck;
}

/**
 * findCard
 * @param cards - array of cards in format 'rank-suit' (e.g., ['3-hearts', '5-spades'])
 * @param targetCard - card to find in format 'rank-suit' (e.g., '5-spades')
 * @returns index of targetCard in cards array or -1 if not found
 */
const findCard = (cards: Card[], targetCard: Card): boolean => {
    return cards.includes(targetCard);
}

export { isCardHigher, sortCards, shuffleDeck, findCard };