/* ===== HintSystem.js — 三階提示 + 閒置觸發 ===== */
import { bus } from '../core/EventBus.js';
import { getLevel } from '../data/levels.js';

export class HintSystem {
  constructor({ scroll } = {}) {
    this.scroll = scroll;
    this.currentLevel = null;
    this.usedStage = 0;      // 本關已用到第幾階
    this.maxStageUsed = 0;   // 全程最高階（成就判定）
    this._bind();
  }

  _bind() {
    bus.on('scene:enter', ({ scene }) => {
      if (scene && scene.startsWith('level')) { this.currentLevel = scene; this.usedStage = 0; }
    });
    // 玩家主動點燈籠
    bus.on('hint:request', ({ stage }) => this.showHint(stage));
    // 閒置觸發（Timer 發）：給模糊提示（第一階）
    bus.on('idle:timeout', () => this.showHint(Math.max(1, this.usedStage + 1)));
  }

  showHint(stage) {
    const lv = getLevel(this.currentLevel);
    if (!lv || !lv.hints) return;
    const s = Math.min(Math.max(stage, 1), lv.hints.length);
    this.usedStage = Math.max(this.usedStage, s);
    this.maxStageUsed = Math.max(this.maxStageUsed, s);
    bus.emit('hint:used', { level: this.currentLevel, stage: s });
    const labels = ['模糊提示', '方向提示', '明確提示'];
    if (this.scroll) {
      this.scroll.show({ title: `燈籠・${labels[s - 1] || '提示'}`, html: `<p>${lv.hints[s - 1]}</p>` });
    }
  }
}
export default HintSystem;
