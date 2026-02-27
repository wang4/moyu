import React, { useEffect, useRef, useState } from 'react';

// Simplified Dino Run clone using React and Canvas
export const DinoRun: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

    const getDifficultySettings = (diff: 'easy' | 'normal' | 'hard') => {
        switch (diff) {
            case 'easy': return { baseSpeed: 2.5, accel: 0.1 };
            case 'hard': return { baseSpeed: 5, accel: 0.5 };
            case 'normal':
            default: return { baseSpeed: 3.5, accel: 0.25 };
        }
    };

    // Game state refs to avoid continuous re-renders
    const state = useRef({
        dino: { x: 50, y: 150, width: 20, height: 20, velocityY: 0, isJumping: false },
        gravity: 0.15,     // Halved from 0.3 (speed halved again)
        jumpPower: -5.3,   // Calculated for ~1.25x height with 0.15 gravity (-7.8 was too high, originally was -6.25 and 0.3)
        // Formula: height = v^2 / 2g. Original: 6.25^2 / (2*0.3) = 65. 
        // New target height = 65 * 1.25 = 81.25.
        // v = sqrt(2 * 0.15 * 81.25) ≈ 4.93 (Adjusting slightly to -5.3 to feel better)
        groundY: 150,
        obstacles: [] as { x: number, width: number, height: number }[],
        gameSpeed: 3,
        animationId: 0,
        frameCount: 0,
    });
    const jump = () => {
        if (!isPlaying && !isGameOver) {
            startGame();
            return;
        }
        if (isGameOver) {
            resetGame();
            startGame();
            return;
        }

        const { dino } = state.current;
        if (!dino.isJumping) {
            dino.velocityY = state.current.jumpPower;
            dino.isJumping = true;
        }
    };

    const startGame = () => {
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        state.current.obstacles = [];
        state.current.gameSpeed = getDifficultySettings(difficulty).baseSpeed;
        state.current.frameCount = 0;
        cancelAnimationFrame(state.current.animationId);
        state.current.animationId = requestAnimationFrame(gameLoop);
    };

    const resetGame = () => {
        setIsPlaying(false);
        setIsGameOver(false);
        setScore(0);
        state.current.dino.y = state.current.groundY;
        state.current.dino.velocityY = 0;
        state.current.dino.isJumping = false;
        state.current.obstacles = [];
        cancelAnimationFrame(state.current.animationId);
        drawInitial();
    };

    const gameLoop = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const s = state.current;
        s.frameCount++;

        // Update Score
        if (s.frameCount % 10 === 0) setScore(sc => sc + 1);

        // Increase speed slowly based on difficulty
        if (s.frameCount % 500 === 0) s.gameSpeed += getDifficultySettings(difficulty).accel;

        // Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Ground
        ctx.beginPath();
        ctx.moveTo(0, s.groundY + s.dino.height);
        ctx.lineTo(canvas.width, s.groundY + s.dino.height);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Update & Draw Dino
        s.dino.velocityY += s.gravity;
        s.dino.y += s.dino.velocityY;

        if (s.dino.y > s.groundY) {
            s.dino.y = s.groundY;
            s.dino.velocityY = 0;
            s.dino.isJumping = false;
        }

        ctx.fillStyle = '#8b5cf6'; // Purple Dino
        ctx.fillRect(s.dino.x, s.dino.y, s.dino.width, s.dino.height);

        // Spawn Obstacles
        if (s.frameCount % 90 === 0 && Math.random() > 0.3) {
            s.obstacles.push({
                x: canvas.width,
                width: 7.5 + Math.random() * 5, // Halved from 15 + Math.random() * 10
                height: 20 + Math.random() * 20
            });
        }

        // Update & Draw Obstacles
        let collision = false;
        for (let i = 0; i < s.obstacles.length; i++) {
            let obs = s.obstacles[i];
            obs.x -= s.gameSpeed;

            ctx.fillStyle = '#ef4444'; // Red Cactus
            ctx.fillRect(obs.x, s.groundY + s.dino.height - obs.height, obs.width, obs.height);

            // Check Collision
            if (
                s.dino.x < obs.x + obs.width &&
                s.dino.x + s.dino.width > obs.x &&
                s.dino.y < s.groundY + s.dino.height &&
                s.dino.y + s.dino.height > s.groundY + s.dino.height - obs.height
            ) {
                collision = true;
            }
        }

        // Remove off-screen obstacles
        s.obstacles = s.obstacles.filter(obs => obs.x + obs.width > 0);

        if (collision) {
            setIsPlaying(false);
            setIsGameOver(true);
            return; // Stop loop
        }

        s.animationId = requestAnimationFrame(gameLoop);
    };

    const drawInitial = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const s = state.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Ground
        ctx.beginPath();
        ctx.moveTo(0, s.groundY + s.dino.height);
        ctx.lineTo(canvas.width, s.groundY + s.dino.height);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Dino static
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(s.dino.x, s.groundY, s.dino.width, s.dino.height);
    };

    // Initial draw and cleanup on unmount
    useEffect(() => {
        drawInitial();
        return () => cancelAnimationFrame(state.current.animationId);
    }, []);

    // Key handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, isGameOver]);

    return (
        <div
            className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl border border-slate-700 h-full min-h-[400px] cursor-pointer select-none group"
            onClick={jump}
        >
            <div className="flex justify-between w-full max-w-lg mb-8 px-4 text-slate-400 font-mono border-b border-slate-700 pb-2 overflow-hidden items-end">
                <div>
                    <span className="text-xs mr-2 text-slate-500">HI</span>
                    <span className="text-xl text-yellow-400">0000</span>
                </div>
                <div className="text-3xl font-bold tracking-widest text-slate-200">
                    {score.toString().padStart(5, '0')}
                </div>
            </div>

            <div className="relative border border-slate-600 rounded overflow-hidden shadow-inner bg-slate-900 group-hover:border-purple-500/50 transition-colors">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full h-auto max-w-[600px] block"
                />

                {!isPlaying && !isGameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm gap-4">
                        <div className="flex gap-2">
                            {(['easy', 'normal', 'hard'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={(e) => { e.stopPropagation(); setDifficulty(d); }}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors border ${difficulty === d ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'}`}
                                >
                                    {d.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div className="text-slate-200 font-bold bg-slate-800 px-6 py-3 rounded-full shadow-xl animate-pulse flex items-center gap-2">
                            🦖 按空格 / 点击跳跃
                        </div>
                    </div>
                )}

                {isGameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 backdrop-blur-[2px]">
                        <div className="text-3xl font-black text-red-400 tracking-widest mb-4 drop-shadow-lg">GAME OVER</div>
                        <div className="text-slate-300 bg-slate-800 px-4 py-2 rounded-full text-sm">点击或按空格重新开始</div>
                    </div>
                )}
            </div>
        </div>
    );
};
