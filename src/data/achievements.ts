// src/data/achievements.ts

export interface Achievement {
    id: string;
    name: string;
    description: string;
    thresholdSeconds: number; // 触发所需摸鱼秒数
    icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'rookie',
        name: '菜鸟摸鱼',
        description: '你已经摸鱼 1 分钟，超越了 1% 的打工人！',
        thresholdSeconds: 60,
        icon: '🐣'
    },
    {
        id: 'toilet',
        name: '带薪拉屎',
        description: '摸鱼 10 分钟，建议出去走走保护视力。',
        thresholdSeconds: 600,
        icon: '🚽'
    },
    {
        id: 'master',
        name: '摸鱼达人',
        description: '摸鱼 30 分钟，老板已经提着刀在路上了。',
        thresholdSeconds: 1800,
        icon: '🧘'
    },
    {
        id: 'thief',
        name: '工资小偷',
        description: '摸鱼 1 小时！你的工资已经到账了一杯奶茶钱。',
        thresholdSeconds: 3600,
        icon: '🥷'
    },
    {
        id: 'capitalist_killer',
        name: '资本家克星',
        description: '摸鱼 4 小时！你来公司就是为了瓦解资本的吗？',
        thresholdSeconds: 14400,
        icon: '🧨'
    },
    {
        id: 'lawless',
        name: '无法无天',
        description: '你不仅摸鱼，还想打老板？给你发个奖状！',
        thresholdSeconds: 99999999, // 隐藏成就不通过时间解锁
        icon: '👑'
    }
];
