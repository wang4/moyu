import { useState, useEffect, useRef, useCallback } from 'react';
import { ACHIEVEMENTS, type Achievement } from '../data/achievements';

const STORAGE_KEY = 'moyu_data_v2';

export interface MoyuData {
    totalSeconds: number; // 历史累积摸鱼秒数
    unlockedIds: string[]; // 已解锁的成就 ID
    currentSkin: string;   // 选择的伪装皮肤
}

const DEFAULT_DATA: MoyuData = {
    totalSeconds: 0,
    unlockedIds: [],
    currentSkin: 'dashboard'
};

export const useMoyuData = () => {
    // 从 localStorage 恢复数据
    const [data, setData] = useState<MoyuData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch { }
        return DEFAULT_DATA;
    });

    // 本次会话秒数，仅用于 UI 展示
    const [sessionSeconds, setSessionSeconds] = useState(0);

    // 新解锁的成就通知队列 (可以使用 toast 库，这里自己简单实现)
    const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);

    // 避免 setData 的依赖陷阱
    const dataRef = useRef(data);
    useEffect(() => {
        dataRef.current = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // 核心计时器
    useEffect(() => {
        const timer = setInterval(() => {
            setSessionSeconds(s => s + 1);

            setData(prevData => {
                const newTotal = prevData.totalSeconds + 1;

                const newlyUnlocked = ACHIEVEMENTS.find(a =>
                    newTotal >= a.thresholdSeconds &&
                    !prevData.unlockedIds.includes(a.id)
                );

                if (newlyUnlocked) {
                    setNewUnlock(newlyUnlocked);
                    setTimeout(() => setNewUnlock(null), 5000);
                    return { ...prevData, totalSeconds: newTotal, unlockedIds: [...prevData.unlockedIds, newlyUnlocked.id] };
                }

                return { ...prevData, totalSeconds: newTotal };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 手动触发彩蛋成就
    const unlockSecret = useCallback(() => {
        const currentData = dataRef.current;
        if (!currentData.unlockedIds.includes('lawless')) {
            const secret = ACHIEVEMENTS.find(a => a.id === 'lawless');
            if (secret) {
                setData({
                    ...currentData,
                    unlockedIds: [...currentData.unlockedIds, 'lawless']
                });
                setNewUnlock(secret);
                setTimeout(() => setNewUnlock(null), 5000);
            }
        }
    }, []);

    return {
        data,
        sessionSeconds,
        achievements: ACHIEVEMENTS.map(a => ({
            ...a,
            isUnlocked: data.unlockedIds.includes(a.id)
        })),
        newUnlock,
        unlockSecret
    };
};

export const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};
