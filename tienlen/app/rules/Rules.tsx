"use client";
import React, { useState } from 'react';
import styles from './Rules.module.scss';

const Rules: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleRules = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleRules}>
                Rules
            </button>
            <div className={styles.rulesModal} style={{ opacity: isOpen ? '1' : '0', pointerEvents: isOpen ? 'auto' : 'none' }}>
                <button className={styles.closeButton} onClick={toggleRules}>X</button>
                <div className={styles.rulesContent}>
                    <h2>Tiến Lên Rules</h2>
                    <h3>Objective</h3>
                    <p>The objective of Tiến Lên is to be the first player to get rid of all your cards.</p>
                    <h3>Card Rankings</h3>
                    <p>Cards are ranked from 3 (lowest) to 2 (highest). Suits are ranked from Spades (lowest), Clubs, Diamonds, to Hearts (highest).</p>
                    <h3>Gameplay</h3>
                    <ul>
                        <li>Each player is dealt 13 cards.</li>
                        <li>The player with the 3 of Spades starts the game by playing that card.</li>
                        <li>Players take turns playing higher-ranking cards or combinations of cards.</li>
                        <li>If a player cannot or chooses not to play, they pass their turn.</li>
                        <li>If you pass your turn, you cannot play again until a new round starts.</li>
                        <li>The round continues until all players pass consecutively. The last player to play starts the next round.</li>
                    </ul>
                    <h3>Available Combinations</h3>
                    <ul>
                        <li>Single Card: Any single card.</li>
                        <li>Pair: Two cards of the same rank.</li>
                        <li>Three of a Kind: Three cards of the same rank.</li>
                        <li>Straight: Three or more consecutive cards of any suit.</li>
                        <li>Four of a Kind: Four cards of the same rank</li>
                    </ul>
                    <h3>Winning the Game</h3>
                    <p>The first player to get rid of all their cards wins the game. The game can continue to determine second, third, and fourth places.</p>
                </div>
            </div>
        </div>
    );
};

export default Rules;