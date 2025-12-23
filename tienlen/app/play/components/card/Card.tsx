import React, { useEffect } from 'react';
import styles from './Card.module.scss';

interface CardProps {
    suit: 'H' | 'D' | 'C' | 'S';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
    hidden?: boolean;
    playable?: boolean;
    handleCardClick?: (suit: string, rank: string) => void;
}

const Card: React.FC<CardProps> = ({ suit, rank, hidden, playable = false, handleCardClick }) => {
    const [selected, setSelected] = React.useState(false);
    const getSuitSymbol = (suit: string) => {
        switch (suit) {
            case 'H': return '♥';
            case 'D': return '♦';
            case 'C': return '♣';
            case 'S': return '♠';
            default: return '';
        }
    };

    useEffect(() => {
        if (!playable) {
            setSelected(false);
        }
    }, [playable]);

    const isRed = suit === 'H' || suit === 'D';
    return (
        <>
            {hidden ? (
                <div className={styles.cardBack}>
                </div>
            ) : (
                <div 
                    className={`${styles.card}
                                ${isRed ? styles.red : styles.black}
                                ${playable ? styles.playing : ''}
                                ${selected ? styles.selected : ''}
                                `}
                    onClick = {() => {
                        if (playable && handleCardClick) {
                            handleCardClick(suit, rank);
                            setSelected(!selected);
                        }
                    }}
                >
                    <div className={styles.top}>
                        <span>{rank}</span>
                        <span>{getSuitSymbol(suit)}</span>
                    </div>
                    <div className={styles.center}>
                        {getSuitSymbol(suit)}
                    </div>
                    <div className={styles.bottom}>
                        <span>{rank}</span>
                        <span>{getSuitSymbol(suit)}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default Card;