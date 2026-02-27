import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMoyuData } from '../../hooks/useMoyuData';

interface TaskCard {
    id: number;
    text: string;
    x: number;
    y: number;
    speed: number;
}

const BOSS_QUOTES = [
    "周一能不能上线？",
    "把颜色改成五彩斑斓的黑",
    "预算是0，你们想想办法",
    "加个AI功能，很简单吧",
    "下班前发我",
    "把这个Logo放大一点，再放大一点",
    "字写大点，但别占地方",
    "怎么又出Bug了？"
];

export const TaskCrusher: React.FC = () => {
    const { unlockSecret } = useMoyuData();
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [tasks, setTasks] = useState<TaskCard[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const bossClickCountRef = useRef(0);
    const lastBossClickTimeRef = useRef(0);

    const [bossShake, setBossShake] = useState(false);
    const [bossFly, setBossFly] = useState(false);

    const spawnTask = useCallback(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const newTask: TaskCard = {
            id: Date.now() + Math.random(),
            text: BOSS_QUOTES[Math.floor(Math.random() * BOSS_QUOTES.length)],
            x: Math.max(10, Math.random() * (width - 160)), // ensure padding on both left and right sides
            y: Math.random() * 200, // Spawn randomly in the upper 200px of the panel instead of starting just off-screen

            speed: 1 + Math.random() * 2 + (score / 50) // Gets faster
        };
        setTasks(prev => [...prev, newTask]);
    }, [score]);

    const updateTasks = useCallback(() => {
        setTasks(prev => {
            let missed = false;
            const next = prev.filter(t => {
                if (t.y > 500) { // Increased bound to match new taller panel
                    missed = true;
                    return false;
                }
                return true;
            }).map(t => ({ ...t, y: t.y + t.speed }));

            if (missed) setCombo(0);
            return next;
        });

        if (isPlaying) {
            if (Math.random() < 0.02 + (score / 1000)) {
                spawnTask();
            }
            requestRef.current = requestAnimationFrame(updateTasks);
        }
    }, [isPlaying, score, spawnTask]);

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(updateTasks);
        } else {
            setTasks([]);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, updateTasks]);

    const crushTask = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setTasks(prev => prev.filter(t => t.id !== id));
        setScore(s => s + 10 + (combo * 2));
        setCombo(c => c + 1);

        // Create click effect
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.transform = 'scale(1.5) rotate(15deg)';
        btn.style.opacity = '0';

        if (combo > 10) setBossShake(true);
        if (combo > 30 && !bossFly) setBossFly(true);
    };

    useEffect(() => {
        if (bossShake) {
            const timer = setTimeout(() => setBossShake(false), 500);
            return () => clearTimeout(timer);
        }
    }, [bossShake]);

    useEffect(() => {
        if (bossFly) {
            const timer = setTimeout(() => setBossFly(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [bossFly]);

    // SECRET EASTER EGG LOGIC
    const handleBossHeadClick = () => {
        const now = Date.now();
        // Allow up to 800ms between clicks to register as a rapid combo.
        if (now - lastBossClickTimeRef.current < 800) {
            bossClickCountRef.current += 1;
        } else {
            bossClickCountRef.current = 1;
        }
        lastBossClickTimeRef.current = now;

        if (bossClickCountRef.current >= 3) {
            unlockSecret();
            bossClickCountRef.current = 0;
            setBossFly(true); // Let him fly as bonus
        }
    };

    return (
        <div
            className="flex flex-col items-center p-6 bg-slate-800 rounded-xl border border-slate-700 h-full min-h-[600px] relative overflow-hidden select-none"
            onClick={() => { if (!isPlaying) { setIsPlaying(true); setScore(0); setCombo(0); } }}
        >
            {/* HUD */}
            <div className="absolute top-4 left-6 flex flex-col z-20">
                <span className="text-slate-400 text-sm font-bold tracking-wider">SCORE</span>
                <span className="text-3xl font-black text-purple-400">{score}</span>
            </div>

            <div className="absolute top-4 right-6 flex flex-col items-end z-20">
                <span className="text-slate-400 text-sm font-bold tracking-wider">COMBO</span>
                <span className={`text-3xl font-black ${combo > 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                    x{combo}
                </span>
            </div>

            {!isPlaying ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-30 backdrop-blur-sm cursor-pointer hover:bg-slate-900/70 transition-colors">
                    <div className="text-8xl mb-6">🤬</div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-widest text-center">需求粉碎机</h2>
                    <p className="text-slate-300 bg-slate-800/80 px-6 py-3 rounded-full border border-slate-600 font-medium">点击屏幕开始暴揍</p>
                </div>
            ) : (
                <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden cursor-crosshair">
                    {/* BOSS HEAD at the bottom middle */}
                    <div
                        className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-8xl transition-transform duration-200 cursor-pointer z-0
              ${bossShake ? 'animate-bounce drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' : ''} 
              ${bossFly ? '-translate-y-[800px] rotate-[720deg] scale-50 opacity-0 duration-1000' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBossHeadClick();
                        }}
                        title="点我试试？"
                    >
                        {bossShake ? '😵' : '👨‍💼'}
                    </div>

                    {/* Falling Tasks */}
                    {tasks.map(t => (
                        <button
                            key={t.id}
                            onClick={(e) => crushTask(e, t.id)}
                            className="absolute bg-white text-slate-900 font-bold px-4 py-3 rounded-lg shadow-xl border-b-4 border-slate-300 transition-all active:scale-90 z-20 flex"
                            style={{
                                left: `${t.x}px`,
                                top: `${t.y}px`,
                                maxWidth: '140px',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                cursor: 'pointer'
                            }}
                        >
                            📄 {t.text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
