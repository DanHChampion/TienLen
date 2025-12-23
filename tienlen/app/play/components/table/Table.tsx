'use client';

import React, { use, useEffect } from 'react';
import styles from './Table.module.scss';
import { Game } from '../../utils/game';
import Player from '../player/Player';
import { useState } from 'react';
import Card from '../card/Card';
import { Card as CardType } from '../../types/card';
import { error } from 'console';

interface TableProps {
    
}

const Table: React.FC<TableProps> = ({}) => {
    // create game class instance and initialize with state
    const [game] = useState(() => new Game(['You', 'Bob', 'Charlie', 'Diana']));
    const [gameData, setGameData] = useState(() => game.getGameData());
    const [error, setError] = useState<string | null>(null);

    // Function to update game state
    const updateGameState = () => {
        console.log("Updating game state...");
        const newGameData = game.getGameData();
        setGameData(JSON.parse(JSON.stringify(newGameData))); // Deep clone to ensure new reference
    };

    const handleStartGame = () => {
        console.log("Starting game...");
        game.startGame();
        updateGameState();
    };

    const handlePlayerMove = (cards: CardType[]) => {
        try {
            game.playerMove(cards);
            updateGameState();
        } catch (error) {
            console.error(error);
            setError((error as Error).message);
            return;
        }
    };

    useEffect(() => {
        if (gameData.gameState === 'playing' && gameData.currentPlayerId !== gameData.players.find(player => player.isPlayer)?.id) {
            console.log("AI turn...");
            setTimeout(() => {
                game.playTurn();
                updateGameState();
            }, 1000);
        }
    }, [gameData]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        handleStartGame();
    }, []);

    return (
        <div className={styles.table}>
            <div className={styles.stats}>
                <div>Round: {Math.floor(gameData.turn / 4) + 1}</div>
                {gameData.gameState !== 'waiting' && 
                    <div>
                        <button onClick={() => {handleStartGame()}}>⟲</button>
                    </div>
                }
            </div>
            {gameData.players.map((player, index) => (
                <Player
                    key={player.id}
                    name={player.name}
                    cards={player.cards}
                    isCurrentPlayer={player.id === gameData.currentPlayerId}
                    position={(['bottom', 'left', 'top', 'right'] as const)[index]}
                    isPlayer={player.isPlayer}
                    handlePlayerMove={handlePlayerMove}
                    gameData={gameData}
                />
            ))}

            <div className={styles.centerArea}>
                {gameData.gameState === 'playing' && gameData.lastPlayedCards && (
                    <div>
                        <div className={styles.cards}>
                            {gameData.lastPlayedCards.cards.map((card, index) => (
                                <Card key={index} suit={card.suit} rank={card.rank} />
                            ))}
                        </div>
                    </div>
                )}
                {error && (
                    <div className={styles.errorPopup}>
                        {error}
                    </div>
                )}
                {gameData.gameState === 'finished' &&
                    <div className={styles.gameOver}>
                        Game Over!
                        <br />
                        <button onClick={handleStartGame}>Play Again?</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Table;