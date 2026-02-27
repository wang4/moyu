import React, { useState } from 'react';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type Result = 'win' | 'lose' | 'draw' | null;

const CHOICES = [
    { id: 'rock', emoji: '✊', label: '石头' },
    { id: 'scissors', emoji: '✌️', label: '剪刀' },
    { id: 'paper', emoji: '🖐️', label: '布' }
];

export const RockPaperScissors: React.FC = () => {
    const [playerChoice, setPlayerChoice] = useState<Choice>(null);
    const [computerChoice, setComputerChoice] = useState<Choice>(null);
    const [result, setResult] = useState<Result>(null);
    const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

    const play = (choice: Choice) => {
        if (!choice) return;

        // Simulate thinking delay
        setPlayerChoice(choice);
        setComputerChoice(null);
        setResult(null);

        setTimeout(() => {
            const compIdx = Math.floor(Math.random() * 3);
            const compChoice = CHOICES[compIdx].id as Choice;
            setComputerChoice(compChoice);

            let res: Result = 'draw';
            if (choice === compChoice) {
                res = 'draw';
            } else if (
                (choice === 'rock' && compChoice === 'scissors') ||
                (choice === 'scissors' && compChoice === 'paper') ||
                (choice === 'paper' && compChoice === 'rock')
            ) {
                res = 'win';
            } else {
                res = 'lose';
            }

            setResult(res);
            setScore(s => ({ ...s, [res!]: s[res!] + 1 }));
        }, 600);
    };

    const reset = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl border border-slate-700 h-full min-h-[400px]">
            <div className="flex justify-between w-full max-w-sm mb-8 px-4 text-slate-400 font-mono text-sm border-b border-slate-700 pb-4">
                <div className="text-green-400">胜: {score.win}</div>
                <div className="text-slate-400">平: {score.draw}</div>
                <div className="text-red-400">负: {score.lose}</div>
            </div>

            <div className="flex w-full max-w-sm justify-between items-center mb-12 relative min-h-[120px]">
                {/* Player Side */}
                <div className="flex flex-col items-center">
                    <div className="text-sm text-purple-400 mb-2 font-bold tracking-widest">YOU</div>
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-6xl shadow-inner ${playerChoice ? 'bg-slate-700/50 scale-110 transition-transform' : 'bg-slate-800 border-2 border-dashed border-slate-700'}`}>
                        {playerChoice ? CHOICES.find(c => c.id === playerChoice)?.emoji : '🤔'}
                    </div>
                </div>

                <div className="text-2xl font-black italic text-slate-600 px-4">VS</div>

                {/* Computer Side */}
                <div className="flex flex-col items-center">
                    <div className="text-sm text-blue-400 mb-2 font-bold tracking-widest">CPU</div>
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-6xl shadow-inner ${computerChoice ? 'bg-slate-700/50 scale-110 transition-transform' : 'bg-slate-800 border-2 border-dashed border-slate-700'}`}>
                        {playerChoice && !computerChoice ? (
                            <div className="animate-spin w-8 h-8 opacity-50 text-2xl">⏳</div>
                        ) : (
                            computerChoice ? CHOICES.find(c => c.id === computerChoice)?.emoji : '🤖'
                        )}
                    </div>
                </div>

                {/* Result Badge */}
                {result && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max px-6 py-2 rounded-full font-black text-xl shadow-2xl z-10 animate-bounce ${result === 'win' ? 'bg-green-500 text-white' :
                            result === 'lose' ? 'bg-red-500 text-white' :
                                'bg-slate-600 text-white'
                        }`}>
                        {result === 'win' ? 'YOU WIN!' : result === 'lose' ? 'YOU LOSE' : 'DRAW'}
                    </div>
                )}
            </div>

            {!result && !playerChoice ? (
                <div className="flex gap-4">
                    {CHOICES.map(c => (
                        <button
                            key={c.id}
                            onClick={() => play(c.id as Choice)}
                            className="w-16 h-16 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors text-3xl shadow-lg hover:-translate-y-1 active:translate-y-0"
                        >
                            {c.emoji}
                        </button>
                    ))}
                </div>
            ) : (
                <button
                    onClick={reset}
                    className={`px-8 py-3 rounded-full font-bold shadow-lg transition-colors ${playerChoice && !result ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                    disabled={!!playerChoice && !result}
                >
                    {playerChoice && !result ? '对决中...' : '再来一局'}
                </button>
            )}
        </div>
    );
};
