/* ===== config.js — 全域常數 ===== */
export const CONFIG = {
  version: 1,
  levelSeconds: 480,        // 每關倒數（8 分鐘，僅氛圍/成就，不強制失敗）
  idleHintMs: 180000,       // 閒置 3 分鐘給提示
  totalTargetSeconds: 2400, // 40 分鐘通關成就門檻
  audio: { bgm: 0.7, sfx: 0.8 },
  hintStages: 3,
};
export default CONFIG;
