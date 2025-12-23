import React, { useEffect } from 'react';
import styles from './Player.module.scss';
import Card from '../card/Card';
import { Card as CardType } from '../../types/card';
import { Player as PlayerType } from '../../types/player';

interface PlayerProps {
    name: string;
    cards: CardType[];
    isCurrentPlayer: boolean;
    position: 'top' | 'right' | 'bottom' | 'left';
    isPlayer: boolean;
    handlePlayerMove: (cards: CardType[]) => void;
    gameData: any;
}

const Player: React.FC<PlayerProps> = ({ 
    name, 
    cards, 
    isCurrentPlayer, 
    position,
    isPlayer,
    handlePlayerMove,
    gameData
}) => {

    const [cardsSelected, setCardsSelected] = React.useState<CardType[]>([]);

    const handleCardClick = (suit: string, rank: string) => {
        setCardsSelected(prevSelected => {
            const cardIndex = prevSelected.findIndex(card => card.suit === suit && card.rank === rank);
            if (cardIndex > -1) {
                // Card is already selected, remove it
                const newSelected = [...prevSelected];
                newSelected.splice(cardIndex, 1);
                return newSelected;
            } else {
                // Card is not selected, add it
                const card = cards.find(c => c.suit === suit && c.rank === rank);
                return card ? [...prevSelected, card] : prevSelected;
            }
        });
    };

    const handlePlayCards = (cards: CardType[]) => {
        try {
            handlePlayerMove(cards);
        } catch (error) {
            console.error(error);
            return;
        }
    };

    useEffect(() => {
        setCardsSelected([]);
    }, [gameData]);

    return (
        <div className={`${styles.player} ${styles[position]} ${isCurrentPlayer ? styles.currentPlayer : ''}`}>
            <div className={cards.length === 0 ? styles.finishedPlayer : ''}>{name}</div>
            {isPlayer && gameData.gameState === 'playing' && isCurrentPlayer &&
                <button onClick={() => handlePlayCards(cardsSelected)}>
                    {cardsSelected.length === 0 ? 'Pass' : 'Play'}
                </button>
            }

            {cards.length > 0 && (
                <div className={styles.cards}>
                    {cards.map((card, index) => (
                        <Card 
                            key={index}
                            suit={card.suit} 
                            rank={card.rank}
                            hidden={!isPlayer && gameData.gameState !== 'finished'}
                            handleCardClick={() => handleCardClick(card.suit, card.rank)}
                            playable={isPlayer && isCurrentPlayer}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Player;