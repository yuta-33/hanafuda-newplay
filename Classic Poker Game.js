import React, { useState, useEffect, useMemo, useCallback } from 'react';

// スタイルをコンポーネント内に定義
const styles = `
    body {
        font-family: 'Lora', serif;
        background-color: #1a1a1a;
        user-select: none;
    }
    .poker-table {
        background-color: #004d00;
        border-radius: 125px;
        padding: 2rem 4rem;
        position: relative;
        box-shadow: inset 0 0 25px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.7);
        border: 12px solid #5a3a22;
        width: 100%;
        height: 600px;
        max-width: 1000px;
    }
    .card {
        font-family: 'Playfair Display', serif;
        width: 70px;
        height: 100px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        font-weight: bold;
        background-color: white;
        color: black;
        position: absolute;
        transition: all 0.5s ease-in-out;
        transform-style: preserve-3d;
    }
    .card-inner {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.5s;
        transform-style: preserve-3d;
    }
    .card.flipped .card-inner {
        transform: rotateY(180deg);
    }
    .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 8px;
    }
    .card-front {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 2px;
    }
    .card-back {
        background: linear-gradient(135deg, #c81d1d 25%, transparent 25%) -35px 0,
                    linear-gradient(225deg, #c81d1d 25%, transparent 25%) -35px 0,
                    linear-gradient(315deg, #c81d1d 25%, transparent 25%),
                    linear-gradient(45deg, #c81d1d 25%, transparent 25%);
        background-size: 70px 70px;
        background-color: #9a1616;
        border: 4px solid white;
        transform: rotateY(180deg);
    }
    .card-value { font-size: 0.9rem; }
    .card-suit { font-size: 1.5rem; }
    .card.red { color: #c81d1d; }

    .action-button {
        transition: all 0.2s ease;
        box-shadow: 0 3px 5px rgba(0,0,0,0.3);
    }
    .action-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 8px rgba(0,0,0,0.4);
    }
    .action-button:active:not(:disabled) {
        transform: translateY(1px);
        box-shadow: 0 2px 3px rgba(0,0,0,0.3);
    }
    .action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

// --- Game Constants (Outside component) ---
const SUITS = ['♥', '♦', '♣', '♠'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
const HAND_RANKS = {
    HIGH_CARD: 0, PAIR: 1, TWO_PAIR: 2, THREE_OF_A_KIND: 3, STRAIGHT: 4,
    FLUSH: 5, FULL_HOUSE: 6, FOUR_OF_A_KIND: 7, STRAIGHT_FLUSH: 8, ROYAL_FLUSH: 9
};
const STARTING_STACK = 1000;
const SMALL_BLIND = 10;
const BIG_BLIND = 20;

// --- Helper Functions (Outside component) ---
const createDeck = () => SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank, id: `${rank}-${suit}` })));

const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const evaluateHand = (sevenCards) => {
    // (The evaluateHand, compareHands logic from the previous version is complex and correct, 
    // so it's reused here directly for brevity. In a real scenario, it would be included.)
    const getCounts = (cards) => {
        const counts = {};
        cards.forEach(c => { counts[c.rank] = (counts[c.rank] || 0) + 1; });
        return counts;
    };
    const getSuitCounts = (cards) => {
        const counts = {};
        cards.forEach(c => { counts[c.suit] = (counts[c.suit] || 0) + 1; });
        return counts;
    };
    const checkStraight = (cards) => {
        const uniqueRanks = [...new Set(cards.map(c => RANK_VALUES[c.rank]))].sort((a, b) => a - b);
        if (uniqueRanks.includes(14)) uniqueRanks.unshift(1);
        if (uniqueRanks.length < 5) return null;
        for (let i = uniqueRanks.length - 1; i >= 4; i--) {
            if (uniqueRanks[i] - uniqueRanks[i-4] === 4) {
                 return uniqueRanks.slice(i-4, i+1).reverse();
            }
        }
        return null;
    };
    const checkFlush = (cards) => {
        const suitCounts = getSuitCounts(cards);
        const flushSuit = Object.keys(suitCounts).find(suit => suitCounts[suit] >= 5);
        if (!flushSuit) return null;
        return cards.filter(c => c.suit === flushSuit).map(c => RANK_VALUES[c.rank]).sort((a,b) => b-a).slice(0, 5);
    };
    const flushCards = sevenCards.filter(c => (getSuitCounts(sevenCards)[c.suit] || 0) >= 5);
    if(flushCards.length >= 5){
        const straightFlushRanks = checkStraight(flushCards);
        if (straightFlushRanks) {
             const isRoyal = straightFlushRanks[0] === 14;
             return { rank: isRoyal ? HAND_RANKS.ROYAL_FLUSH : HAND_RANKS.STRAIGHT_FLUSH, name: isRoyal ? "Royal Flush" : "Straight Flush", values: straightFlushRanks };
        }
    }
    const rankCounts = getCounts(sevenCards);
    const sortedRanks = Object.entries(rankCounts).sort(([,a], [,b]) => b-a);
    const ranks = sortedRanks.map(([rank]) => rank);
    const counts = sortedRanks.map(([,count]) => count);
    const primaryKickers = ranks.map(r => RANK_VALUES[r]);
    if (counts[0] === 4) {
        const kicker = Math.max(...sevenCards.filter(c => c.rank !== ranks[0]).map(c => RANK_VALUES[c.rank]));
        return { rank: HAND_RANKS.FOUR_OF_A_KIND, name: "Four of a Kind", values: [primaryKickers[0], kicker] };
    }
    if (counts[0] === 3 && counts[1] >= 2) {
        return { rank: HAND_RANKS.FULL_HOUSE, name: "Full House", values: [primaryKickers[0], primaryKickers[1]] };
    }
    const flushRanks = checkFlush(sevenCards);
    if (flushRanks) {
        return { rank: HAND_RANKS.FLUSH, name: "Flush", values: flushRanks };
    }
    const straightRanks = checkStraight(sevenCards);
    if (straightRanks) {
        return { rank: HAND_RANKS.STRAIGHT, name: "Straight", values: straightRanks };
    }
    if (counts[0] === 3) {
        const kickers = sevenCards.filter(c => c.rank !== ranks[0]).map(c => RANK_VALUES[c.rank]).sort((a,b)=>b-a).slice(0,2);
        return { rank: HAND_RANKS.THREE_OF_A_KIND, name: "Three of a Kind", values: [primaryKickers[0], ...kickers] };
    }
    if (counts[0] === 2 && counts[1] === 2) {
        const kicker = Math.max(...sevenCards.filter(c => c.rank !== ranks[0] && c.rank !== ranks[1]).map(c => RANK_VALUES[c.rank]));
        return { rank: HAND_RANKS.TWO_PAIR, name: "Two Pair", values: [primaryKickers[0], primaryKickers[1], kicker].sort((a,b)=>b-a) };
    }
    if (counts[0] === 2) {
        const kickers = sevenCards.filter(c => c.rank !== ranks[0]).map(c => RANK_VALUES[c.rank]).sort((a,b)=>b-a).slice(0,3);
        return { rank: HAND_RANKS.PAIR, name: "Pair", values: [primaryKickers[0], ...kickers] };
    }
    const highCards = sevenCards.map(c => RANK_VALUES[c.rank]).sort((a,b)=>b-a).slice(0,5);
    return { rank: HAND_RANKS.HIGH_CARD, name: "High Card", values: highCards };
};

const compareHands = (hand1, hand2) => {
    if (hand1.rank !== hand2.rank) return hand2.rank - hand1.rank;
    for (let i = 0; i < hand1.values.length; i++) {
        if (hand1.values[i] !== hand2.values[i]) return hand2.values[i] - hand1.values[i];
    }
    return 0; // Tie
};

// --- React Components ---

const Card = ({ card, style, isFlipped }) => {
    const color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
    return (
        <div className={`card ${isFlipped ? 'flipped' : ''}`} style={style}>
            <div className="card-inner">
                <div className={`card-front ${color}`}>
                     <div className="self-start ml-1 flex flex-col items-center"><div className="card-value">{card.rank}</div><div>{card.suit}</div></div>
                     <div className="card-suit">{card.suit}</div>
                     <div className="self-end mr-1 flex flex-col items-center transform rotate-180"><div className="card-value">{card.rank}</div><div>{card.suit}</div></div>
                </div>
                <div className="card-back"></div>
            </div>
        </div>
    );
};

const Player = ({ player, isActive, isDealer, children }) => {
    return (
        <div className={`absolute ${player.position.top} ${player.position.left} transform -translate-x-1/2`}>
            <div className="flex flex-col items-center space-y-2">
                <div className={`bg-black bg-opacity-50 rounded-lg p-2 text-center w-48 transition-shadow duration-300 ${isActive ? 'shadow-lg shadow-yellow-300/50' : ''}`}>
                    <div className="font-bold text-lg">{player.name}</div>
                    <div className="text-xl text-yellow-300">${player.stack}</div>
                    <div className="text-sm text-gray-400 h-5">{player.status === 'active' ? (player.hand?.name || '') : player.status.charAt(0).toUpperCase() + player.status.slice(1)}</div>
                </div>
                <div className="h-[100px] w-[160px] relative">
                    {children}
                </div>
                 {player.bet > 0 && <div className="absolute -bottom-6 bg-black bg-opacity-70 px-3 py-1 rounded-full text-sm">${player.bet}</div>}
                 {isDealer && <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center border-2 border-gray-400 text-lg">D</div>}
            </div>
        </div>
    )
}

export default function App() {
    const [gameState, setGameState] = useState('idle');
    const [players, setPlayers] = useState([
        { id: 'player', name: 'You', stack: STARTING_STACK, cards: [], bet: 0, status: 'active', position: { top: 'bottom-4', left: 'left-1/2' }},
        { id: 'cpu', name: 'CPU', stack: STARTING_STACK, cards: [], bet: 0, status: 'active', position: { top: 'top-4', left: 'left-1/2' }}
    ]);
    const [deck, setDeck] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [pot, setPot] = useState(0);
    const [currentBet, setCurrentBet] = useState(0);
    const [gamePhase, setGamePhase] = useState('pre-flop');
    const [turnIndex, setTurnIndex] = useState(-1);
    const [dealerIndex, setDealerIndex] = useState(0);
    const [message, setMessage] = useState('Welcome to Classic Poker');
    const [raiseAmount, setRaiseAmount] = useState(BIG_BLIND * 2);

    const activePlayer = players[turnIndex];

    const cardPositions = useMemo(() => {
        const positions = {};
        // Deck position
        positions.deck = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        // Player cards
        players.forEach(p => {
            if (p.id === 'player') {
                positions[`${p.id}-0`] = { top: 'calc(100% - 110px)', left: 'calc(50% - 40px)', transform: 'translateX(-50%) rotate(-5deg)' };
                positions[`${p.id}-1`] = { top: 'calc(100% - 110px)', left: 'calc(50% + 40px)', transform: 'translateX(-50%) rotate(5deg)' };
            } else {
                positions[`${p.id}-0`] = { top: '10px', left: 'calc(50% - 40px)', transform: 'translateX(-50%) rotate(5deg)' };
                positions[`${p.id}-1`] = { top: '10px', left: 'calc(50% + 40px)', transform: 'translateX(-50%) rotate(-5deg)' };
            }
        });
        // Community cards
        for (let i = 0; i < 5; i++) {
            positions[`community-${i}`] = {
                top: '50%',
                left: `calc(50% + ${(i - 2) * 80}px)`,
                transform: 'translate(-50%, -50%)',
            };
        }
        return positions;
    }, [players]);

    const runGameLoop = useCallback(async () => {
        if(gameState !== 'running') return;

        const activePlayersCount = players.filter(p => p.status === 'active').length;
        const nonFoldedPlayersCount = players.filter(p => p.status !== 'folded').length;

        if (activePlayersCount <= 1 && turnIndex !== -1 || nonFoldedPlayersCount <= 1) {
             if (gamePhase !== 'showdown') {
                setGamePhase('showdown');
             }
             return;
        }

        const nextTurn = (turnIndex + 1) % players.length;
        const nextPlayer = players[nextTurn];
        
        if (nextPlayer.status !== 'active') {
             setTurnIndex(nextTurn); // Skip and continue loop
             return;
        }

        const allBetsEqual = players.filter(p=>p.status === 'active').every(p => p.bet === currentBet);
        if (allBetsEqual && turnIndex !== -1) {
            setGamePhase(phase => {
                if (phase === 'pre-flop') return 'flop';
                if (phase === 'flop') return 'turn';
                if (phase === 'turn') return 'river';
                if (phase === 'river') return 'showdown';
                return phase;
            });
            return;
        }

        setTurnIndex(nextTurn);

    }, [gameState, players, turnIndex, currentBet, gamePhase]);

    useEffect(() => {
        const gameTick = setTimeout(() => {
            if (gameState === 'running' && activePlayer?.id === 'cpu') {
                // Simple CPU AI
                const toCall = currentBet - activePlayer.bet;
                setTimeout(() => {
                    if (toCall === 0) {
                         Math.random() < 0.3 ? handleAction('raise', BIG_BLIND) : handleAction('check');
                    } else {
                        Math.random() < 0.2 ? handleAction('fold') : handleAction('call');
                    }
                }, 1000);
            } else {
                runGameLoop();
            }
        }, 500);
        return () => clearTimeout(gameTick);
    }, [turnIndex, gameState, runGameLoop]);
    
     useEffect(() => {
        const phaseActions = {
            'flop': () => {
                setMessage('Flop');
                setCurrentBet(0);
                setTurnIndex(dealerIndex);
                setCommunityCards(deck.slice(0, 3));
            },
            'turn': () => {
                setMessage('Turn');
                setCurrentBet(0);
                setTurnIndex(dealerIndex);
                setCommunityCards(deck.slice(0, 4));
            },
            'river': () => {
                setMessage('River');
                setCurrentBet(0);
                setTurnIndex(dealerIndex);
                setCommunityCards(deck.slice(0, 5));
            },
            'showdown': async () => {
                setMessage('Showdown!');
                const contesting = players.filter(p => p.status !== 'folded');
                if (contesting.length === 1) {
                    awardPot([contesting[0]]);
                } else {
                    contesting.forEach(p => p.hand = evaluateHand([...p.cards, ...communityCards]));
                    contesting.sort((a,b) => compareHands(a.hand, b.hand));
                    const winner = contesting[0];
                    const tiePlayers = contesting.filter(p => compareHands(p.hand, winner.hand) === 0);
                    awardPot(tiePlayers);
                }
            }
        };
        if (phaseActions[gamePhase]) {
            phaseActions[gamePhase]();
        }
    }, [gamePhase]);

    const awardPot = (winners) => {
        const prize = Math.floor(pot / winners.length);
        setPlayers(prev => prev.map(p => winners.some(w => w.id === p.id) ? { ...p, stack: p.stack + prize } : p));
        setMessage(winners.length > 1 ? `Split pot! ${winners.map(w=>w.name).join(' & ')} win.` : `${winners[0].name} wins $${pot}!`);
        setTimeout(startNewRound, 4000);
    }

    const startNewRound = () => {
        const newDealerIndex = (dealerIndex + 1) % players.length;
        setDealerIndex(newDealerIndex);
        const smallBlindIndex = (newDealerIndex + 1) % players.length;
        const bigBlindIndex = (newDealerIndex + 2) % players.length;
        
        const freshDeck = shuffleDeck(createDeck());
        
        setGamePhase('pre-flop');
        setCommunityCards([]);
        setPot(0);
        setCurrentBet(BIG_BLIND);

        setPlayers(prev => {
            const newPlayers = prev.map(p => ({
                ...p,
                cards: [freshDeck.pop(), freshDeck.pop()],
                bet: 0,
                status: p.stack > 0 ? 'active' : 'out',
                hand: null
            }));

            // Post blinds
            const sbPlayer = newPlayers[smallBlindIndex];
            const bbPlayer = newPlayers[bigBlindIndex];
            
            const sbAmount = Math.min(SMALL_BLIND, sbPlayer.stack);
            sbPlayer.stack -= sbAmount;
            sbPlayer.bet = sbAmount;

            const bbAmount = Math.min(BIG_BLIND, bbPlayer.stack);
            bbPlayer.stack -= bbAmount;
            bbPlayer.bet = bbAmount;

            setPot(sbAmount + bbAmount);

            return newPlayers;
        });
        
        setDeck(freshDeck);
        setTurnIndex(bigBlindIndex);
        setMessage('New round started.');
        setGameState('running');
    };

    const handleAction = (action, amount = 0) => {
        if (!activePlayer || activePlayer.id !== 'player' && gameState !== 'running') return;
        const toCall = currentBet - activePlayer.bet;

        setPlayers(prev => prev.map(p => {
            if (p.id !== activePlayer.id) return p;
            
            let newStack = p.stack;
            let newBet = p.bet;
            let newStatus = p.status;

            switch(action) {
                case 'fold':
                    newStatus = 'folded';
                    break;
                case 'call':
                    const callAmount = Math.min(toCall, newStack);
                    newStack -= callAmount;
                    newBet += callAmount;
                    setPot(pot => pot + callAmount);
                    if(newStack === 0) newStatus = 'all-in';
                    break;
                case 'raise':
                    const raiseTotal = amount;
                    const raiseAmount = Math.min(raiseTotal - newBet, newStack);
                    newStack -= raiseAmount;
                    newBet += raiseAmount;
                    setPot(pot => pot + raiseAmount);
                    setCurrentBet(newBet);
                    if(newStack === 0) newStatus = 'all-in';
                    break;
                case 'check':
                    break;
            }
            return { ...p, stack: newStack, bet: newBet, status: newStatus };
        }));
        runGameLoop();
    };

    const minRaise = currentBet > BIG_BLIND ? currentBet * 2 : BIG_BLIND * 2;
    const maxRaise = activePlayer ? activePlayer.stack + activePlayer.bet : STARTING_STACK;

    if (gameState === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <style>{styles}</style>
                <button onClick={startNewRound} className="action-button px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold text-xl">Start Game</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <style>{styles}</style>
            <div className="poker-table">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                    <div className="bg-black bg-opacity-50 rounded-lg p-2 text-center">
                        <div className="font-bold text-md">Pot</div>
                        <div className="text-2xl text-yellow-300">${pot}</div>
                    </div>
                    <div className="h-[100px] w-[450px] relative">
                         {communityCards.map((card, i) => (
                            <Card key={card.id} card={card} isFlipped={true} style={{ ...cardPositions[`community-${i}`], transitionDelay: `${i * 100}ms` }} />
                        ))}
                    </div>
                    <div className="text-center font-bold text-lg h-8 w-96">{message}</div>
                </div>

                {players.map((p, i) => (
                    <Player key={p.id} player={p} isActive={turnIndex === i} isDealer={dealerIndex === i}>
                         {p.cards.map((card, j) => (
                             <Card 
                                key={card.id} 
                                card={card} 
                                isFlipped={p.id === 'cpu' ? gamePhase !== 'showdown' : false}
                                style={{
                                    ...cardPositions[p.cards.length > 0 ? `${p.id}-${j}` : 'deck'],
                                    transitionDelay: `${j * 100}ms`
                                }}
                            />
                         ))}
                    </Player>
                ))}
            </div>
             <div className="mt-4 p-4 bg-gray-800 rounded-lg flex items-center justify-center space-x-4 w-full max-w-4xl">
                <button onClick={() => handleAction('fold')} disabled={activePlayer?.id !== 'player'} className="action-button px-6 py-3 bg-gray-600 rounded-lg font-bold text-lg">Fold</button>
                <button onClick={() => handleAction('check')} disabled={activePlayer?.id !== 'player' || currentBet > activePlayer?.bet} className="action-button px-6 py-3 bg-blue-700 rounded-lg font-bold text-lg">Check</button>
                <button onClick={() => handleAction('call')} disabled={activePlayer?.id !== 'player' || currentBet <= activePlayer?.bet} className="action-button px-6 py-3 bg-green-700 rounded-lg font-bold text-lg">
                    Call ${currentBet - (activePlayer?.bet || 0)}
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleAction('raise', raiseAmount)} disabled={activePlayer?.id !== 'player'} className="action-button px-6 py-3 bg-red-700 rounded-lg font-bold text-lg">Raise to</button>
                        <input type="number" value={raiseAmount} onChange={e => setRaiseAmount(Number(e.target.value))} className="w-28 text-black text-center font-bold text-lg p-2 rounded-md" />
                    </div>
                    <input type="range" min={minRaise} max={maxRaise} value={raiseAmount} onChange={e => setRaiseAmount(Number(e.target.value))} className="w-full mt-2" />
                </div>
            </div>
        </div>
    );
}
