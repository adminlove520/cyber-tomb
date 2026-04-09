export type Theme = 'cyber' | 'zen' | 'classic';

export const THEMES: { id: Theme; name: string; icon: string }[] = [
  { id: 'cyber', name: '赛博 (Cyber)', icon: '⚡' },
  { id: 'zen', name: '禅意 (Zen)', icon: '🍃' },
  { id: 'classic', name: '经典 (Classic)', icon: '🏮' },
];
